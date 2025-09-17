import { createContext, useEffect, useState, } from "react";
import type { ReactNode } from "react";
import { supabase } from "../services/supabaseClient";

interface AuthProviderProps {
    children: ReactNode
}

type AuthContextData = {
    signed: boolean
    loading: boolean
    handleSaveInfoUser: ({id, email, name}: UserProps) => void
    user: UserProps | null
}

interface UserProps {
    id: string,
    email: string | null,
    name: string | null
}

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const {data: {subscription: {unsubscribe}}} = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser({
                    id: session.user.id,
                    email: session.user.user_metadata.email,
                    name: session.user.user_metadata.fullName
                })
                setLoading(false)
            } else {
                console.error("Não existe usuario logado")
                setUser(null)
                setLoading(false)

            }
        })

        return () =>{
            unsubscribe()
        }
    }, [])

    function handleSaveInfoUser({id, name, email}: UserProps){
        setUser({
            id,
            name,
            email
        })
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, loading, handleSaveInfoUser, user}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider