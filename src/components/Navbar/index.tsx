import { Link } from "react-router-dom"
import "./style.scss"

function logout() {
    localStorage.removeItem("access_token_moto")
}

export function Navbar() {
    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <nav className="menu">
                <div className="dropdown">
                    <Link className="nav-item dropbtn" to="/home"><i className="fa fa-home"></i>Home</Link>
                </div>
                <div className="dropdown">
                    <Link className="nav-item dropbtn" to="#"><i className="fa fa-motorcycle"></i>Produtos</Link>
                    <div className="dropdown-content">
                        <Link to="/product">Lista de Produtos</Link>
                        <Link to="/register-product">Cadastro de Produtos</Link>
                    </div>
                </div>
                <div className="dropdown">
                    <Link className="nav-item dropbtn" to="#"><i className="fa fa-usd"></i>Caixa</Link>
                    <div className="dropdown-content">
                        <Link to="/finances">Ver caixa</Link>
                        <Link to="/cart">Ver carrinho</Link>
                        <Link to="/new-sale">Nova venda</Link>
                    </div>
                </div>
                <div className="dropdown">
                    <Link className="nav-item dropbtn" to="/login" onClick={logout}><i className="fa fa-sign-out"></i>Sair</Link>
                </div>
            </nav>
        </>
    )
}
