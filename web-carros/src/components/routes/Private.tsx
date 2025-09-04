import { useContext, type ReactNode } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Navigate } from "react-router";


interface PrivateRouteProps{
    children: ReactNode
}

export function PrivateRoute({children}: PrivateRouteProps){
    const {loading, signed} = useContext(AuthContext)

    if(loading){
        return <div>Carregando...</div>
    }
    
    if(!signed){
        return <Navigate to="/login" replace />
    }

    return children
}