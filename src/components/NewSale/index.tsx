import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import APIService from "../../services/APIService";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useEffect, useState } from "react";
import { Button } from "../Button";
interface ProductProps {
    productName: string;
    description: string;
    uni: number;
    valueInSight: string;
    category: string;
    brand: string;
    image: string;
}

const schema = yup.object({
    productName: yup.string().required()
}).required();

export default function NewSale() {
    const [product, setProduct] = useState("")
    const [selectProduct, setSelectProduct] = useState<ProductProps | undefined>(undefined)

    useEffect(() => {
        const accessTokenMoto = localStorage.getItem("access_token_moto")
        if (!accessTokenMoto) {
            return window.location.replace('/login')
        }
    })

    const { register, handleSubmit, setFocus } = useForm({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate()

    async function registerFinance(data: any) {
        try {
            const product = await APIService.getProductsByCode(data.code)
            const uni_initial = Number(data.uni)
            let uni = Number(data.uni)

            if (Math.sign(uni) === -1) {
                return toast.error("Quantidade de peças maior que o de estoque!")
            }

            if (data.code !== "") {
                uni = Number(product.uni) - data.uni
                const updateProduct = Object.assign(data, { uni })
                await APIService.updateProduct(product._id, updateProduct)
            }
            uni = uni_initial
            Object.assign(data, { uni })
            await APIService.saveSale(data)

            toast.success("Venda realizada com sucesso!")
            navigate("../finances")

        } catch (e) {
            toast.error("Erro ao efetuar venda")
            console.log("erro ao realizar venda", e)
        }
    }

    async function getProduct(e: any,) {
        try {
            e.preventDefault()
            const getCode = (document.getElementById("code") as HTMLInputElement).value
            const _product = await APIService.getProductsByCode(getCode)
            setSelectProduct(_product)
            setFocus("productName", { shouldSelect: true })


        } catch (e) {
            toast.error("Erro ao buscar produto")
            console.log("erro ao consultar produto", e)
        }
    }

    function focusInput() {
        setFocus("description")
    }

    return (
        <>
            <div className="code-search">
                <form>
                    <div>
                        <label htmlFor={"code"}>Código do produto</label>
                        <div>
                            <input type="text"
                                id="code"
                                placeholder='Código'
                                value={product}
                                {...register("code", {
                                    onChange: e => setProduct(e.target.value)
                                })}

                            />
                            <Button type="submit" name={"Buscar"} onClick={getProduct} />
                        </div>
                    </div>

                </form>
            </div>

            <h3>
                {selectProduct?.productName &&
                    `
                    Nome: ${selectProduct?.productName} |
                    Unidades: ${selectProduct?.uni} |
                    Valor Custo: ${selectProduct?.valueInSight} |
                    Categoria: ${selectProduct?.category} |
                    Marca: ${selectProduct?.brand} 
                `
                }
            </h3>

            {selectProduct?.image && (
                <div className="product-image">
                    <img src={selectProduct?.image} alt="Imagem do produto" width={"8%"} />
                </div>
            )}

            <form onSubmit={handleSubmit(registerFinance)}>
                <label htmlFor={"productName"}>Nome Produto</label>
                <input type="text"
                    id="productName"
                    placeholder='Nome do produto'
                    required
                    defaultValue={selectProduct?.productName}
                    readOnly={product !== ""}
                    {...register("productName")}
                />

                <label htmlFor={"description"}>Descrição</label>
                <input type="text"
                    id="description"
                    placeholder='Descrição'
                    defaultValue={selectProduct?.description}
                    readOnly={product !== ""}
                    {...register("description")}
                />

                <label htmlFor={"uni"}>Unidades</label>
                <input type="number"
                    id="uni"
                    placeholder='Unidade'
                    required
                    {...register("uni")}
                />

                <label htmlFor={"valueInSight"}>Forma de pagamento</label>
                <select
                    id="form-payment"
                    defaultValue={""}
                    {...register("formPayment", {
                        onChange: focusInput
                    })}
                    required
                >
                    <option value="" disabled>Selecione a forma de pagamento</option>
                    <option value="DINHEIRO">DINHEIRO</option>
                    <option value="PIX">PIX</option>
                    <option value="CARTAO">CARTÃO</option>

                </select>

                <label htmlFor={"category"}>Valor Pago</label>
                <input type="number"
                    id="amountPaid"
                    step="0.010"
                    min={0}
                    max={1000}
                    placeholder='Valor Pago'
                    required
                    {...register("amountPaid")}
                />
                <input type="submit" value={"Salvar"} />
            </form>
        </>
    )
}