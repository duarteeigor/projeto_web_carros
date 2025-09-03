import { Outlet } from "react-router"
import { Header } from "../header/Header"

export default function Layout(){

    return(
        <>
            <Header />
            <Outlet />
        </>
    )
}