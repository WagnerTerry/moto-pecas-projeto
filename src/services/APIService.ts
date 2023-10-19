import axios from 'axios'

//const productionBaseURL = "https://moto-pecas-api-production.up.railway.app";
//const localBaseURL = "http://localhost:3333";

// conexão railway - postgres
// const BaseURL =  "https://moto-pecas-api-production.up.railway.app"

// conexão mongoDB Atlas
const BaseURL = "https://moto-api.vercel.app"

// conexão mongoDB localhost
// const BaseURL = "http://localhost:3002"
interface ProductFormEditProps {
    productName?: string;
    code?: string;
    description?: string;
    uni?: number;
    valueInSight?: string;
    category?: string;
    brand?: string;
    image?: string;
}

export default class APIService{
    static getProducts = async () => {
        const result = await axios.get(`${BaseURL}/products`)
        return result.data
    }

    static getProductsByCode = async (code: any) => {
        const result = await axios.get(`${BaseURL}/products/${code}`)
        return result.data
    }

    static saveProduct = async (data: string) => {
        const result = await axios.post(`${BaseURL}/products`, data)
        return result.data
    }

    static updateProduct = async (_id: string, data: ProductFormEditProps) => {
        const {productName, code, description, uni, valueInSight, category, brand, image} = data
        const payload = {
            _id,
            productName, 
            code,
            description,
            uni,
            valueInSight,
            category,
            brand,
            image
        }
        const result = await axios.put(`${BaseURL}/products/${_id}`, payload)
        return result.data
    }

    static deleteProduct = async (id: string) => {
        const result = await axios.delete(`${BaseURL}/products/${id}`)
        return result.data
    }

    static getFinances = async () => {
        const result = await axios.get(`${BaseURL}/finances`)
        return result.data
    }

    static saveSale = async (data: any) => {
        const result = await axios.post(`${BaseURL}/finances`, data)
        return result.data
    }

    static deleteSale = async (id: string) => {
        const result = await axios.delete(`${BaseURL}/finances/${id}`)
        return result.data
    }

    static deleteAllSale = async () => {
        const result = await axios.delete(`${BaseURL}/finances/all`)
        return result.data
    } 

    static login = async (user: string, password: string) => {
        const payload = {
            user, 
            password
        }
        const result = await axios.post(`${BaseURL}/login`, payload)
        return result.data
    }

    static signUp = async (user: string, password: string) => {
        const payload = {
            user, 
            password
        }
        const result = await axios.post(`${BaseURL}/login/signup`, payload)
        return result.data
    }
}