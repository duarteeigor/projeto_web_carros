import {createBrowserRouter} from "react-router"
import Layout from "./components/layout/Layout"
import {Home}  from "./pages/home"
import { Dashboard } from "./pages/dashboard"
import { CarDetails } from "./pages/car"
import { Login } from "./pages/login"
import { Register } from "./pages/register"
import { DashboardNew } from "./pages/dashboard/new"
import { PrivateRoute } from "./components/routes/Private"



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
                element: <PrivateRoute><Dashboard /></PrivateRoute>
            },
             {
                path: "/dashboard/new",
                element: <PrivateRoute><DashboardNew /></PrivateRoute>
            },
            {
                path: "/car/:id",
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