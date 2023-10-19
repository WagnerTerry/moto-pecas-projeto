import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import APIService from "../../services/APIService";
import { yupResolver } from '@hookform/resolvers/yup';
import NoImage from "../../assets/no_image.svg"
import * as yup from "yup";

const schema = yup.object({
    productName: yup.string().required()
}).required();

interface ProductFormProps {
    _id?: string;
    productName: string;
    code?: string;
    description?: string;
    uni?: number;
    valueInSight: string;
    category?: string;
    brand?: string;
    image?: string;

}

export default function ProductForm(props: ProductFormProps) {
    const { register, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate()

    async function addProduct(data: any) {
        const uni = Number(data.uni)
        Object.assign(data, { uni })
        if (props._id) {
            changeProduct(props._id, data)
        }
        else {
            try {
                const capital_name = data.productName.toUpperCase()
                const products = await APIService.getProducts()
                const duplicate_name = products.filter((prod: any) => prod.productName.toUpperCase() === capital_name)
                const productCode = products.filter((prod: any) => prod.code === data.code)

                if (duplicate_name.length > 0) {
                    return toast.error("Já existe um produto com esse nome, coloque outro nome")
                }

                if (productCode.length > 0) {
                    return toast.error("Já existe um produto com esse código, coloque outro código")
                }

                await APIService.saveProduct(data)
                toast.success("Produto criado com sucesso")
                reset()
                console.log("produto cadastrado: ", data)
            } catch (e) {
                toast.error("Erro ao criar produto")
                console.log("Ocorreu um erro ao criar produto", e)
            }
        }
    }

    async function changeProduct(id: string, data: ProductFormProps) {
        try {
            await APIService.updateProduct(id, data)
            toast.success("Produto atualizado")
            console.log("Produto atualizado", data)
            navigate("../product")
        } catch (e) {
            console.log("aqui no changeProducts")

            toast.error("Erro ao atualizar produto")
            console.log("Ocorreu um erro ao atualizar produto")
        }
    }
    return (

        <form onSubmit={handleSubmit(addProduct)}>
            <label htmlFor={"productName"}>Nome Produto</label>
            <input type="text"
                id="productName"
                placeholder='Nome do produto'
                defaultValue={props.productName}
                required
                {...register("productName")}
            />
            <label htmlFor={"code"}>Código</label>
            <input type="text"
                id="code"
                placeholder='Código'
                defaultValue={props.code}
                required
                {...register("code")}
            />
            <label htmlFor={"description"}>Descrição</label>
            <input type="text"
                id="description"
                placeholder='Descrição'
                defaultValue={props.description}
                {...register("description")}
            />
            <label htmlFor={"uni"}>Unidades</label>
            <input type="number"
                id="uni"
                placeholder='Unidade'
                defaultValue={props.uni}
                required
                {...register("uni")}
            />
            <label htmlFor={"valueInSight"}>Valor Custo</label>
            <input type="text"
                id="valueInSight"
                placeholder='Valor Custo'
                defaultValue={props.valueInSight}
                required
                {...register("valueInSight")}
            />
            <label htmlFor={"category"}>Categoria</label>
            <input type="text"
                id="category"
                placeholder='Categoria'
                defaultValue={props.category}
                {...register("category")}
            />
            <label htmlFor={"brand"}>Marca</label>
            <input type="text"
                id="brand"
                placeholder='Marca'
                defaultValue={props.brand}
                {...register("brand")}
            />
            <label htmlFor={"image"}>Imagem</label>
            <input type="text"
                id="image"
                placeholder='Link da Imagem'
                defaultValue={props.image}
                {...register("image")}
            />
            <img src={props.image ? props.image : NoImage} alt={props.image ? props.image : "Imagem do produto"} width={"8%"} />
            <input type="submit" value={"Salvar"} />
        </form>
    )
}
