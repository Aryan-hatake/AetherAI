import { createBrowserRouter } from 'react-router-dom'
import Login from '../features/auth/UI/pages/Login'
import Register from '../features/auth/UI/pages/Register'
import Protected from '../features/auth/UI/components/Protected'
import Verify from '../features/auth/UI/pages/Verify'
import Dashboard from '../features/chat/UI/pages/Dashboard'
export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element:
         <Protected>
            <Dashboard/>
        </Protected>
    },
    {
        path:"/verify",
        element:<Verify/>
    }
])
