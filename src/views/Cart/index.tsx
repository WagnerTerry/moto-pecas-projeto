import React, { useEffect, useState } from 'react'
import { Header } from '../../components/Header'
import { Summary } from '../../components/Summary'

import "./style.scss"
import { TableRow } from '../../components/TableRow'

interface TableProps {
    _id: string;
    productName: string;
    description: string;
    uni?: number;
    quantity?: number;
    valueInSight: string;
    category: string;
    amount: string;
    image: string;
}

export function Cart() {
    const [cart, setCart] = useState<TableProps[]>([])
    const [subTotal, setSubTotal] = useState(localStorage.getItem("subTotal")) || ""
    const [subTotalCart, setSubTotalCart] = useState<TableProps[]>([])
    const [, setQuantity] = useState(1)

    useEffect(() => {
        const cartStorage = JSON.parse(localStorage.getItem("cart") || "")
        const subTotalCart = JSON.parse(localStorage.getItem("subTotalCart") || "")

        setCart(cartStorage)
        setSubTotalCart(subTotalCart)

    }, [subTotal])

    function countQuantity(quantity: number, initialValue: number, id: string) {
        subTotalCart.filter((ct: any) => {
            if (ct._id !== id) {
                if (quantity > ct.quantity) {
                    return setQuantity(initialValue + 1)
                } else if (ct.quantity < quantity) {
                    return setQuantity(initialValue - 1)
                }

            }
        })
    }

    function handleRemoveItem(id: string) {
        const newCart = cart.filter((ct) => ct._id !== id)
        setCart(newCart)
        localStorage.setItem("cart", JSON.stringify(newCart))
        localStorage.setItem("subTotalCart", JSON.stringify(newCart))
        handleTotalValue(newCart)
    }

    function handleTotalValue(cart: any) {
        const initialValue = 0
        const amount = cart.map((ct: any) => parseFloat(ct.valueInSight))
        const subTotalValue = amount.reduce((accumulator: any, currentValue: any) => accumulator + currentValue, initialValue).toFixed(2)
        setSubTotal(subTotalValue)
        return localStorage.setItem("subTotal", subTotalValue)
    }

    return (
        <div id="cart">
            <Header title={"Carrinho"} />
            <div className="content">
                <section>
                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Preço</th>
                                <th>Quantidade</th>
                                <th>Total</th>
                                <th>Excluir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subTotalCart.length === 0 ?
                                <tr>
                                    <td colSpan={5} className='empty-cart'>
                                        <span>Carrinho vazio</span>
                                    </td>
                                </tr>
                                :
                                subTotalCart.map((item, idx) => (
                                    <TableRow
                                        key={idx}
                                        _id={item._id}
                                        productName={item.productName}
                                        description={item.description}
                                        quantity={item.quantity}
                                        uni={item.uni}
                                        valueInSight={item.valueInSight}
                                        amount={item.amount}
                                        category={item.category}
                                        image={item.image}
                                        handleRemoveItem={handleRemoveItem}
                                        countQuantity={countQuantity}
                                    />
                                ))}
                        </tbody>
                    </table>
                </section>
                <aside>
                    <Summary subTotal={subTotal} />
                </aside>
            </div>
        </div>

    )
}