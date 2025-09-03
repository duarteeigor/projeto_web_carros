import {createBrowserRouter} from "react-router"
import Layout from "./components/layout/Layout"
import {Home}  from "./pages/home"
import { Dashboard } from "./pages/dashboard"
import { CarDetails } from "./pages/car"
import { Login } from "./pages/login"
import { Register } from "./pages/register"



const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/dashboard",
                element: <Dashboard />
            },
            {
                path: "/cardetails",
                element: <CarDetails />
            }
        ]
    },

    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    }
])

export {router}