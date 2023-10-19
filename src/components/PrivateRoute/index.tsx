import React from 'react';

import { Navigate, Outlet } from 'react-router-dom'

const useAuth = () => {
    const user = localStorage.getItem('access_token_moto')
    if (user) {
        return true
    } else {
        return false
    }
}

const PrivateRoute = (props: any) => {

    const auth = useAuth()

    return auth ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute;