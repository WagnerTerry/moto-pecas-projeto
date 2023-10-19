import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import TokenService from "../../services/TokenService";
import ProductForm from "../../components/ProductForm";

import "./style.scss"

export function RegisterProduct() {
    const location = useLocation()
    const _product: any = location.state
    const [products] = useState(_product)

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

    })

    return (
        <div id="register-products">
            <Header title={"Cadastro de Produto"} />

            <ProductForm
                _id={products && products._id ? products._id : null}
                productName={products ? products.productName : null}
                code={products ? products.code : null}
                description={products && products.description ? products.description : null}
                uni={products && products.uni ? products.uni : null}
                valueInSight={products && products.valueInSight ? products.valueInSight : null}
                category={products && products.category ? products.category : null}
                brand={products && products.brand ? products.brand : null}
                image={products && products.image ? products.image : null}
            />

        </div>
    )
}