import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from 'react-router'
import { router } from './routes.tsx'
import AuthProvider from './contexts/AuthContext.tsx'

import { Toaster } from "react-hot-toast"

createRoot(document.getElementById('root')!).render(
    <>
        <Toaster
            position='top-right'
            reverseOrder={false} 
        />
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </>

)
