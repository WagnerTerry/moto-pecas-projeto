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

const PublicRoutes = (props: any) => {

  const auth = useAuth()

  return auth ? <Navigate to="/home" /> : <Outlet />
}

export default PublicRoutes;