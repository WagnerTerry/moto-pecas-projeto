import { useEffect } from 'react'
import { Header } from "../../components/Header"
import MotorCycle from '../../assets/moto.jpg'
import TokenService from "../../services/TokenService"

import "./style.scss"

export function Home() {

    useEffect(() => {
        const accessTokenMoto = localStorage.getItem("access_token_moto")
        let cart = JSON.parse(localStorage.getItem("cart") || String(0))
        let subTotalCart = JSON.parse(localStorage.getItem("subTotalCart") || String(0))

        if (!accessTokenMoto) {
            return window.location.replace('/login')
        }

        if (cart === 0) {
            cart = []
            localStorage.setItem("cart", JSON.stringify(cart))
        }

        if (subTotalCart === 0) {
            subTotalCart = []
            localStorage.setItem("subTotalCart", JSON.stringify(subTotalCart))
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
        <div id="home">
            <Header title={"Federal Moto Peças"} />
            <img src={MotorCycle} alt="imagem de uma moto" />
        </div>
    )
}