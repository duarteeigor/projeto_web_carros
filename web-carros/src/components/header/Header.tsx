import { FiLogIn } from "react-icons/fi"
import { FiUser } from "react-icons/fi"
import logoImg from "../../assets/logo.svg"
import { Link } from "react-router"


export function Header() {
    const signed = false
    const loading = false

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

            {!loading && !signed &&(
                <Link to="/login">
                    <FiLogIn size={26} color="#000" />
                </Link>
            )}
        </header>
        </div>
        
    )
}