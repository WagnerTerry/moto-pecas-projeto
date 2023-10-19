import "./style.scss"

export function Button(props: any) {
    return (
        <button onClick={props.onClick} className={props.classname}>{props.name}</button>
    )
}