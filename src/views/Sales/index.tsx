import { useEffect } from "react";
import { Header } from "../../components/Header";
import NewSale from "../../components/NewSale";
import TokenService from "../../services/TokenService";

import "./style.scss"

export function Sales() {

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
        <div id="sales">
            <Header title={"Nova Venda"} />
            <NewSale />
        </div>
    )
}