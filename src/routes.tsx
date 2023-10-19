import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./views/Home";
import { Product } from "./views/Product";
import { Finance } from "./views/Finance";
import { RegisterProduct } from "./views/RegisterProduct";
import { Sales } from "./views/Sales";
import { Login } from "./views/Login";
import { Cart } from './views/Cart'
import { NotFound } from "./views/NotFound";

import PrivateRoute from './components/PrivateRoute'
import PublicRoutes from "./components/PublicRoutes";

export function routes() {
    return (
        <Router>
            <Routes>
                {/** Private Routes */}
                <Route path="/" element={<PrivateRoute />} >
                    <Route path={"/"} element={<Home />} />
                    <Route path={"/home"} element={<Home />} />
                    <Route path={"/login"} element={<Login />} />
                    <Route path={"/product"} element={<Product />} />
                    <Route path={"/register-product"} element={<RegisterProduct />} />
                    <Route path={"/finances"} element={<Finance />} />
                    <Route path={"/new-sale"} element={<Sales />} />
                    <Route path={"/cart"} element={<Cart />} />
                    <Route path="*" element={<NotFound />} />
                </Route>

                {/** Public Routes */}

                <Route path="login" element={<PublicRoutes />}>
                    <Route path="/login" element={<Login />} />
                </Route>
            </Routes>
        </Router >
    )
}