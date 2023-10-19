import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import Loading from "../../components/Loading";
import APIService from "../../services/APIService"
import TokenService from "../../services/TokenService";

import "./style.scss"

interface ProductProps {
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

export function Product() {
    const [products, setProducts] = useState([] as any)
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [foundProduct, setFoundProduct] = useState(products);
    const [, setProductName] = useState("");

    const navigate = useNavigate()


    useEffect(() => {
        const accessTokenMoto = localStorage.getItem("access_token_moto")
        if (!accessTokenMoto) {
            return window.location.replace('/login')
        }

        const checkExpirationDate = async () => {
            const decodedToken = JSON.parse(await TokenService.getDecodedToken(accessTokenMoto))
            const expiresIn = decodedToken.exp
            const currentDate = Math.floor(Date.now() / 1000) // converter Data atual em Unix / seconds
            if (expiresIn < currentDate) {
                localStorage.removeItem("access_token_moto")
                return window.location.replace('/login')
            }
        }
        checkExpirationDate()

        const showProducts = async () => {
            const _products = await APIService.getProducts()
            setProducts(_products)
            setLoading(false);
        }

        showProducts()
        setTimeout(() => setIsLoading(false), 4000)
    }, [])

    async function addCart(id: any, data: ProductProps) {
        try {
            if (id) {
                let cart = JSON.parse(localStorage.getItem("cart") || String(0))
                const valueInSight = parseFloat(data.valueInSight)

                if (cart === 0 || cart.length === 0) {
                    console.log("carrinho vazio")
                    let addCart = []
                    const productUnit = Number(data.uni) - 1
                    data.uni = productUnit
                    addCart.push(data)
                    localStorage.setItem("cart", JSON.stringify(addCart))
                    localStorage.setItem("subTotalCart", JSON.stringify(addCart))

                    localStorage.setItem("subTotal", (valueInSight).toFixed(2))
                    return toast.success("Produto adicionado ao carrinho!")

                }
                const checkCartId = cart.filter((ct: any) => ct._id === id)
                if (checkCartId.length > 0) {
                    return toast.error("Produto já adicionado no carrinho")
                } else {
                    const productUnit = Number(data.uni) - 1
                    data.uni = productUnit
                    cart.push(data)
                    const subTotal = localStorage.getItem("subTotal") || ""
                    const sub = parseFloat(subTotal)
                    const totalValue = (valueInSight + sub)
                    localStorage.setItem("cart", JSON.stringify(cart))
                    localStorage.setItem("subTotalCart", JSON.stringify(cart))

                    localStorage.setItem("subTotal", JSON.stringify(totalValue))
                    return toast.success("Produto adicionado ao carrinho!")
                }

            }
        } catch (e) {
            toast.error("Erro ao adicionar produto no carrinho")
            console.log("Ocorreu um erro ao adicionar produto no carrinho", e)
        }
    }

    async function navigationToUpdateProduct(id: any, data: string) {
        try {
            if (id) {
                navigate("/register-product", { replace: true, state: data })
            }
        } catch (e) {
            toast.error("Erro ao atualizar produto")
            console.log("Ocorreu um erro ao atualizar produto")
        }
    }

    async function deleteProduct(id: any) {
        try {
            await APIService.deleteProduct(id)
            setProducts(products.filter((prod: any) => prod._id !== id))
            setFoundProduct("")
            toast.success("Produto excluído com sucesso!")
        } catch (e) {
            toast.error("Erro ao excluir produto")
            console.log("Ocorreu um erro ao excluir produto", e)
        }
    }

    function searchProduct(e: any) {
        const keyword = e.target.value;

        if (keyword !== "") {
            const results = products.filter((prod: any) => {
                return prod.productName.toLowerCase().startsWith(keyword.toLowerCase());
                // Use the toLowerCase() method to make it case-insensitive
            });
            setFoundProduct(results);
        } else {
            setFoundProduct("");
            // If the text field is empty, show all users
        }

        setProductName(keyword);
    }

    return (
        <div id="product">
            <Header title={"Produto"} />

            <div className="product-list">
                <div className="actions">
                    <Link to="/register-product">
                        <Button name={"Cadastrar Produto"} classname={"create"} />
                    </Link>
                    {products.length > 2 && (
                        <div>
                            <input type="search" placeholder="Pesquisar produto" onChange={searchProduct} />
                        </div>
                    )}
                </div>
                <h2>Lista de Produtos</h2>

            </div>

            <main>
                {loading ? (
                    <div className="loading">
                        {isLoading ? (
                            <Loading size={30}></Loading>
                        ) : (
                            <h3>Não há produto cadastrado ou erro ao conectar ao banco</h3>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="search-products">
                            {foundProduct && foundProduct.length > 0
                                ? foundProduct.map((prod: any, idx: any) => (
                                    <div className='show-products'>
                                        {products.length > 0 ?
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Nome</th>
                                                        <th>Código</th>
                                                        <th>Descrição</th>
                                                        <th>Uni</th>
                                                        <th>Valor Custo</th>
                                                        <th>Categoria</th>
                                                        <th>Marca</th>
                                                        <th>Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr key={idx}>
                                                        <td data-label="Nome do Produto">{prod.productName}</td>
                                                        <td data-label="Código do Produto">{prod.code}</td>
                                                        <td data-label="Descrição">{prod.description}</td>
                                                        <td data-label="Unidades">{prod.uni}</td>
                                                        <td data-label="Valor Custo">{prod.valueInSight}</td>
                                                        <td data-label="Categoria">{prod.category}</td>
                                                        <td data-label="Marca">{prod.brand}</td>
                                                        <td>
                                                            <Button name={"Editar"} classname={"edit"} onClick={() => navigationToUpdateProduct(prod._id, products[idx])} />
                                                            <Button name={"Deletar"} classname={"delete"} onClick={() => deleteProduct(prod._id)} />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            : <span>Não há produtos cadastrados</span>
                                        }
                                    </div>
                                ))
                                :
                                <div className='show-products'>
                                    {products.length > 0 ?
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Nome</th>
                                                    <th>Código</th>
                                                    <th>Descrição</th>
                                                    <th>Uni</th>
                                                    <th>Valor Custo</th>
                                                    <th>Categoria</th>
                                                    <th>Marca</th>
                                                    <th>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.sort((a: any, b: any) => a.code - b.code).map((prod: ProductProps, idx: any) => (
                                                    <tr key={idx}>
                                                        <td data-label="Nome do Produto">{prod.productName}</td>
                                                        <td data-label="Código do Produto">{prod.code}</td>
                                                        <td data-label="Descrição">{prod.description}</td>
                                                        <td data-label="Unidades">{prod.uni}</td>
                                                        <td data-label="Valor Custo">{prod.valueInSight}</td>
                                                        <td data-label="Categoria">{prod.category}</td>
                                                        <td data-label="Marca">{prod.brand}</td>
                                                        <td>
                                                            <Button name={"Editar"} classname={"edit"} onClick={() => navigationToUpdateProduct(prod._id, products[idx])} />
                                                            <Button name={"Carrinho"} classname={"cart"} onClick={() => addCart(prod._id, products[idx])} />
                                                            <Button name={"Deletar"} classname={"delete"} onClick={() => deleteProduct(prod._id)} />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        : <span>Não há produtos cadastrados</span>
                                    }
                                </div>
                            }
                        </div>

                    </>
                )
                }
            </main>
        </div>
    )
}