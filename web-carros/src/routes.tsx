import {createBrowserRouter} from "react-router"
import Layout from "./components/layout/Layout"
import {Home}  from "./pages/home"
import { Dashboard } from "./pages/dashboard"
import { CarDetails } from "./pages/car"
import { Login } from "./pages/login"
import { Register } from "./pages/register"
import { DashboardNew } from "./pages/dashboard/new"



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
                path: "/dashboard/new",
                element: <DashboardNew />
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