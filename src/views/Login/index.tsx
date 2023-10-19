import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import APIService from "../../services/APIService";
import Loading from "../../components/Loading";

import "./style.scss"

//  Login simples 

//  const signIn: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
//      e.preventDefault()
//      const user = document.getElementById('user') as HTMLInputElement
//      const password = document.getElementById("password") as HTMLInputElement

//      if (user.value === "motofederal" && password.value === "joaofederal") {
//          toast.success("Login realizado com sucesso!")

//          let token = Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2)
//          localStorage.setItem("token", token)
//          window.location.href = "/home"

//      } else {
//          toast.error("Usuário ou senha incorretos.")
//      }
//  };

export const Login = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const signIn: React.FormEventHandler<HTMLFormElement> = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setLoading(true)
            const user = document.getElementById('user') as HTMLInputElement
            const password = document.getElementById("password") as HTMLInputElement
            const login = await APIService.login(user.value, password.value)
            localStorage.setItem('access_token_moto', login.token)
            toast.success("Login realizado com sucesso!")
            navigate('/home')
        } catch (error) {
            toast.error("Usuário ou senha inválidos")
            console.log("Erro ao fazer login", error)
        } finally {
            setLoading(false)
        }
    }

    const signUp: React.FormEventHandler<HTMLFormElement> = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const user = document.getElementById('user') as HTMLInputElement
            const password = document.getElementById("password") as HTMLInputElement
            await APIService.signUp(user.value, password.value)
            toast.success("Usuário cadastrado com sucesso!")
        } catch (error) {
            toast.error("Erro ao criar usuário")
            console.log("Erro ao criar novo usuário", error)
        }
    }
    return (
        <div id="login">
            <h1>Login</h1>

            <form onSubmit={signIn}>
                <label htmlFor="user">Usuário</label>
                <input id="user" type="text" placeholder="Usuário" required />

                <label htmlFor="password">Senha</label>
                <input id="password" type="password" placeholder="Senha" required />

                {loading ? <Loading size={30}></Loading> : <input type="submit" value={"Entrar"} />}
            </form>
        </div>
    )
}