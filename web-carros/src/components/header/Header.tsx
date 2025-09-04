import { FiLogIn } from "react-icons/fi"
import { FiUser } from "react-icons/fi"
import logoImg from "../../assets/logo.svg"
import { Link } from "react-router"

import { supabase } from "../../services/supabaseClient"
import { useContext } from "react"
import { AuthContext } from "../../contexts/AuthContext"




export function Header() {
    const {loading, signed} = useContext(AuthContext)

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        
    }

    return (
        <div className="w-full flex items-center justify-center bg-white h-16 drop-shadow mb-4 ">
            <header className="w-full max-w-7xl flex items-center justify-between px-4 mx-auto">
                <Link to="/">
                    <img src={logoImg} alt="imagem logo" />
                </Link>


                {!loading && signed && (
                    <Link to="/dashboard">
                        <FiUser size={26} color="#000" />
                    </Link>
                )}

                {!loading && !signed && (
                    <Link to="/login">
                        <FiLogIn size={26} color="#000" onClick={() => signOut()} />
                    </Link>
                )}
            </header>
        </div>

    )
}