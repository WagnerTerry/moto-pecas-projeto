import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

interface TableProps {
    _id: string;
    productName: string;
    description: string;
    uni?: number;
    quantity?: number;
    valueInSight: string;
    category: string;
    amount?: string;
    image: string;
    handleRemoveItem: (_id: string) => void
    countQuantity: (initialValue: number, quantity: number, id: string) => void
}

export const TableRow = (props: TableProps) => {
    const [cart] = useState(JSON.parse(localStorage.getItem("cart") || ""))
    const [quantity, setQuantity] = useState(props.quantity || 1)
    const [amount, setAmount] = useState(props.amount || props.valueInSight)

    const uni = props.uni || 0

    function updateElementById(array: [], id: string, newData: object) {
        return array.map((obj: TableProps) => {
            if (obj._id === id) {
                return { ...obj, ...newData };
            }
            return obj;
        });
    }

    function increaseItem() {
        let subTotalCart = JSON.parse(localStorage.getItem("subTotalCart") || String(0))

        const checkCartId = subTotalCart.filter((ct: TableProps) => ct._id === props._id)

        if (checkCartId[0].uni === 0) {
            return toast.error("Quantidade excedida de itens")
        }
        const qty = quantity + 1
        setQuantity(qty)
        const increaseValue = (parseFloat(props.valueInSight) * qty).toFixed(2)

        if (subTotalCart.length === 0 || subTotalCart === 0) {
            subTotalCart = []
            const cartFilter = cart.filter((ct: TableProps) => ct._id === props._id)
            let newCart = cartFilter[0]
            newCart.valueInSight = increaseValue
            newCart.uni = newCart.uni - 1
            subTotalCart.push(newCart)
            props.countQuantity(quantity, Number(props.quantity), props._id)
            localStorage.setItem("subTotalCart", JSON.stringify(subTotalCart))
        }
        else {
            subTotalCart.map((ct: TableProps) => {
                if (ct._id === props._id) {
                    let amount = checkCartId[0].valueInSight
                    const newData = {
                        uni: checkCartId[0].uni = checkCartId[0].uni - 1,
                        amount: amount = increaseValue,
                        quantity: qty
                    }
                    setAmount(newData.amount)
                    const updatedArray = updateElementById(
                        subTotalCart,
                        props._id,
                        newData
                    );

                    return (
                        localStorage.setItem("subTotalCart", JSON.stringify(updatedArray))
                    )
                }
            })
            if (checkCartId.length === 0) {
                let aux = []
                aux.push(props)
                const newArray = aux.map(elem => {
                    return Object.assign({}, elem, { uni: Number(props.uni) - 1, amount: (parseFloat(props.valueInSight) * qty).toFixed(2) });
                });
                setAmount(newArray[0].amount)

                subTotalCart.push(newArray[0])
                return localStorage.setItem("subTotalCart", JSON.stringify(subTotalCart))
            }
        }
    }

    function decreaseItem() {
        let subTotalCart = JSON.parse(localStorage.getItem("subTotalCart") || String(0))
        const checkCartId = subTotalCart.filter((ct: TableProps) => ct._id === props._id)
        if (checkCartId[0].quantity === 1 || checkCartId[0].quantity === undefined) {
            return toast.error("Quantidade não pode ser menor que 1")
        }

        const qty = quantity - 1
        setQuantity(qty)
        const increaseValue = (parseFloat(props.valueInSight) * qty).toFixed(2)
        subTotalCart.map((ct: TableProps) => {
            if (ct._id === props._id) {
                let amount = ct.valueInSight

                const newData = {
                    uni: Number(ct.uni) + 1,
                    amount: amount = increaseValue,
                    quantity: qty
                }
                const updatedArray = updateElementById(
                    subTotalCart,
                    props._id,
                    newData
                );
                setAmount(newData.amount)

                props.countQuantity(quantity, Number(props.quantity), props._id)
                return (
                    localStorage.setItem("subTotalCart", JSON.stringify(updatedArray))
                )
            }
        })
    }

    return (
        <tr>
            <td>
                <div className="product">
                    <img src={props.image} alt='Imagem do produto' />
                    <div className="info">
                        <div className="name">{props.productName}</div>
                        <div className="category">{props.category}</div>
                    </div>
                </div>
            </td>
            <td>R$ {parseFloat(props.valueInSight).toFixed(2)}</td>
            <td>
                <div className="qty">
                    <button onClick={decreaseItem}>
                        -
                    </button>
                    <span>{quantity}</span>
                    <button onClick={increaseItem}>
                        +
                    </button>
                </div>
            </td>
            <td>R$ {amount} </td>

            <td>
                <button onClick={() => props.handleRemoveItem(props._id)}>Remover</button>
            </td>
        </tr>
    )
}