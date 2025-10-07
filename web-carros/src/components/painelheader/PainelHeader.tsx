import { Link } from "react-router";
import { supabase } from "../../services/supabaseClient";


export function PainelHeader() {
    async function handleLogout(){
        await supabase.auth.signOut()
    }

    return (

        <div className="bg-red-500 h-10 text-white font-medium text-lg flex justify-center items-center gap-6 px-4 rounded-lg">

            <Link className="hover:opacity-90" to="/dashboard">Dashboard</Link>

            <Link className="hover:opacity-90" to="/dashboard/new">Cadastrar Carro</Link>

            <button className="ml-auto hover:opacity-90 cursor-pointer" onClick={handleLogout}>Sair da conta</button>
        </div>


    )
}