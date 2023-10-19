import React, { useEffect, useState } from 'react'

interface SummaryProps {
    subTotal: string | null;
}

export const Summary = (props: SummaryProps) => {
    useEffect(() => {
        addFreight()
        setHeight()

    }, [])

    const [freight, setFreight] = useState(localStorage.getItem("freight") || "")
    const [coupon, setCoupon] = useState(localStorage.getItem("motorcycleCoupon") || "")
    const [discountValue, setDiscountValue] = useState("😃")

    function addFreight() {
        document.getElementById("freigth")?.blur()
        if (freight === "" || freight === "0" || freight === "Grátis") {
            setFreight("Grátis")
            return localStorage.setItem("freight", "0")
        }
        localStorage.setItem("freight", freight)
    }

    function addCoupon() {
        document.getElementById("motorcycleCoupon")?.blur()
        if (coupon === "" || coupon === "0") {
            setCoupon("")
            return localStorage.setItem("motorcycleCoupon", "")
        }
        console.log("coupo", coupon)
        if (coupon === "promo") {
            console.log("A if ppromo", coupon)
            //const discount = coupon.replace(/\D/gim, '')
            setDiscountValue("😁 10%")
            localStorage.setItem("motorcycleCoupon", "10%")
        } else {
            setDiscountValue("😞 Cupom inválido")
            localStorage.setItem("motorcycleCoupon", "")
        }
    }

    function dropIt() {
        toggleClass(document.getElementById('navigation-dropdown'), "hide");
        toggleClass(document.getElementById('navigation-dropdown2'), "hide");
    }

    function setHeight() {
        const el: any = document.getElementById('navigation-dropdown');
        const element: any = document.getElementById('navigation-dropdown2');

        //el.style.height = el.clientHeight + "px";
        el.style.height = el.clientHeight + "16px";
        element.style.height = element.clientHeight + "16px";


    }

    const toggleClass = function (el: any, className: string) {
        if (el) {
            if (el.className.indexOf(className) != -1) {
                el.className = el.className.replace(className, '');
            } else {
                el.className += ' ' + className;
            }
        }
    };

    return (
        <>
            <div className="box">
                <header>Resumo da compra</header>
                <div className='info'>
                    <div>
                        <span>Sub-total</span>
                        <span>R$ {props.subTotal}</span>
                    </div>
                    <div>
                        <span>Frete</span>
                        <div className='freight'> R$
                            <input onKeyUp={(event) => {
                                if (event.key === "Enter") {
                                    addFreight();
                                }
                            }}
                                type="text"
                                id="freigth"
                                value={freight}
                                onChange={(e) => setFreight(e.target.value)}
                                onBlur={() => addFreight()}
                            />
                        </div>
                    </div>
                    <div id="navigation">
                        <div onClick={dropIt} id="navigation-sub">
                            <span className='desc'>Adicionar cupom de desconto
                            </span>
                            <i className="fa fa-arrow-down"></i>
                        </div>
                    </div>
                    <div id='navigation-dropdown' className={"hide"}>
                        <span>Cupom</span>
                        <input
                            onKeyUp={(event) => {
                                if (event.key === "Enter") {
                                    addCoupon();
                                }
                            }}
                            type="text"
                            id="motorcycleCoupon"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            onBlur={() => addCoupon()}
                        />
                    </div>
                    <div id='navigation-dropdown2' className={"hide"}>
                        <span>Desconto</span>
                        <span>{discountValue}</span>
                    </div>

                </div>
                <footer>
                    <span>Total</span>
                    <span>R$ {props.subTotal}</span>
                </footer>
            </div>
            <div>
                <button>Finalizar Compra</button>
            </div>
        </>
    )
}