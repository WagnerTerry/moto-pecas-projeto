import { Navbar } from "../Navbar";
import "./style.scss"

export function Header(props: any) {
    return (
        <header>
            <h1>{props.title}</h1>
            <Navbar />
        </header>
    )
}