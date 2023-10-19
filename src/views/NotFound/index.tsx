import { Link } from "react-router-dom";
import { Button } from "../../components/Button";
import { Header } from "../../components/Header";

import "./style.scss"

export function NotFound() {
    return (
        <div id="not-found">
            <Header title={"Página não encontrada"} />

            <h2>Ops! <br /><br />Não encontramos o endereço solicitado</h2>

            <h2>Não se preocupe, clique no botão abaixo para retornar a Home.</h2>

            <Link to="/home">
                <Button name="Retornar a Home" />
            </Link>

        </div>
    )
}