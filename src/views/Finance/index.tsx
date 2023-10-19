import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Header } from "../../components/Header";
import { jsPDF } from "jspdf";

import Loading from "../../components/Loading";
import APIService from "../../services/APIService";
import TokenService from "../../services/TokenService";

import "./style.scss"
import { Button } from "../../components/Button";

interface SalesProps {
    id?: string;
    productName: string;
    code?: string;
    description?: string;
    uni?: number;
    formPayment: string;
    amountPaid: string;
}

export function Finance() {
    const [sales, setSales] = useState([] as any)
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [amountPaid, setAmountPaidTotal] = useState<any | null>(null);
    const [totalUni, setTotalUni] = useState(0)

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    function floatingNumberConverter(amount: any) {
        return new Intl.NumberFormat("pt-br", {
            currency: "BRL",
            minimumFractionDigits: 2,
        }).format(amount)
    }


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

        const showFinances = async () => {
            const _sales = await APIService.getFinances()
            const salesValue = _sales.map((sal: any) => +sal.amountPaid)
            const units = _sales.map((sal: any) => sal.uni)

            const amountPaidAccumulator = salesValue.reduce((acc: any, element: any) => acc += element, 0)
            const _totalUni = units.reduce((acc: any, element: any) => acc += element, 0)

            const _amountPaidTotal = floatingNumberConverter(amountPaidAccumulator)

            setSales(_sales)
            setAmountPaidTotal(_amountPaidTotal)
            setTotalUni(_totalUni)
            setLoading(false);
        }


        showFinances()
        setTimeout(() => setIsLoading(false), 4000)
    }, [])

    const createPDF = () => {
        // Default export is a4 paper, portrait, using millimeters for units

        const lMargin = 15; //left margin in mm
        const rMargin = 15; //right margin in mm
        const pdfInMM = 210; // width of A4 in mm

        const doc = new jsPDF("p", "mm", "a4")

        const money_value = [] as any
        const card_value = [] as any
        const pix_value = [] as any

        sales.map((sal: any) => sal.formPayment === "DINHEIRO" && money_value.push(+sal.amountPaid))
        sales.map((sal: any) => sal.formPayment === "CARTAO" && card_value.push(+sal.amountPaid))
        sales.map((sal: any) => sal.formPayment === "PIX" && pix_value.push(+sal.amountPaid))


        const text_money = money_value.reduce(
            (acc: any, element: any) => acc + element, 0)

        const text_card = card_value.reduce(
            (acc: any, element: any) => acc += element, 0)

        const text_pix = pix_value.reduce(
            (acc: any, element: any) => acc + element, 0)

        //const lines = doc.splitTextToSize(text_ifood, pdfInMM - lMargin - rMargin);
        doc.text(`Relatório de Pedidos ${formattedDate}`, 85, 10);
        doc.text(`Quantidade de itens vendidos : ${totalUni}`, lMargin, 30);
        doc.text("Formas de Pagamento", 85, 50);
        //doc.text(lMargin, 40, lines);
        doc.text(`DINHEIRO R$ : ${floatingNumberConverter(text_money)}`, lMargin, 70);
        doc.text(`CARTÃO R$ : ${floatingNumberConverter(text_card)}`, lMargin, 80);
        doc.text(`PIX R$: ${floatingNumberConverter(text_pix)}`, lMargin, 90);
        doc.text(`Valor Total : R$ ${amountPaid}`, lMargin, 100);

        doc.save("Relatorio_Caixa_Moto.pdf");

    }

    async function removeSale(prod: any) {
        try {
            await APIService.deleteSale(prod._id)
            setSales(sales.filter((sales: any) => sales._id !== prod._id))
            setAmountPaidTotal((prevState: any) => (parseFloat(prevState) - parseFloat(prod.amountPaid)).toFixed(2))
            setTotalUni((prevState: any) => prevState - prod.uni)

            toast.success("Item removido com sucesso!")
        } catch (e) {
            toast.error("Erro ao excluir item")
            console.log("Erro ao excluir item de venda", e)
        }
    }

    async function newFinance() {
        try {
            if (window.confirm("Ao abrir um novo caixa, os registros serão deletados. Quer prosseguir?")) {
                await APIService.deleteAllSale()
                toast.success("Novo caixa aberto com sucesso!")
                console.log("sales", sales)
                setSales(sales.filter((sales: any) => !sales._id))
                setAmountPaidTotal(0)
                setTotalUni(0)
            }

        } catch (e) {
            toast.error("Erro ao gerar novo caixa")
            console.log("Erro ao gerar novo fluxo de caixa", e)
        }
    }


    return (
        <div id="finance">
            <Header title={"Caixa"} />

            <div className="finance-list">
                <h2>Caixa {formattedDate}</h2>

                <Link to="/new-sale">
                    <button>Nova venda</button>
                </Link>
            </div>

            <main>
                {loading ? (
                    <div className="loading">
                        {isLoading ? (
                            <Loading size={30}></Loading>
                        ) : (
                            <h3>Não há nenhuma venda ou erro ao conectar ao banco</h3>
                        )}
                    </div>
                ) : (
                    <>
                        {sales.length > 0 ?
                            <>
                                <h3>Produtos vendidos</h3>
                                <div className='show-finances'>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Código</th>
                                                <th>Descrição</th>
                                                <th>Uni</th>
                                                <th>Forma de Pagamento</th>
                                                <th>Valor Pago</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sales.sort((a: any, b: any) => (a.productName > b.productName) ? 1 : ((b.productName > a.productName) ? -1 : 0)).map((prod: SalesProps, idx: any) => (
                                                <tr key={idx}>
                                                    <td data-label="Nome do Produto">{prod.productName}</td>
                                                    <td data-label="Código">{prod.code}</td>
                                                    <td data-label="Descrição">{prod.description}</td>
                                                    <td data-label="Unidades">{prod.uni}</td>
                                                    <td data-label="Forma de Pagamento">{prod.formPayment}</td>
                                                    <td data-label="Valor Pago">{prod.amountPaid.replace(".", ",")}</td>
                                                    <td>
                                                        <Button onClick={() => removeSale(prod)} name={"Deletar"} classname={"delete"} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>

                            : <span>Nenhuma venda realizada</span>
                        }
                    </>
                )
                }
            </main>

            {sales.length > 0 && (
                <footer>
                    <div>
                        <Button onClick={createPDF} name={"Relatório"} classname="report" />
                        <Button onClick={newFinance} name={"Novo caixa"} classname="new-finance" />
                    </div>
                    <strong>Valor Total : R$ {amountPaid}</strong>
                </footer>
            )}
        </div>
    )
}