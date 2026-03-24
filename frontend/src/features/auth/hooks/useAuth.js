import { login, register, getMe } from "../services/auth.api";
import { useDispatch } from 'react-redux'
import { setLoading, setUser, setError, setRegisteredEmail } from "../slices/user.slice";
import { socketConnection} from "../sockets/auth.socket";
export function useAuth() {

    const dispatch = useDispatch();


    const handleLogin = async (email, password) => {
        try {
            dispatch(setLoading(true))
            const response = await login(email, password)
            dispatch(setUser(response.user))
            dispatch(setError(null))
        } catch (error) {
            dispatch(setError(error?.message || "Error logging in"))
        } finally {
            dispatch(setLoading(false))
        }
    }
    const handleRegister = async (email, username, password) => {
        try {
            dispatch(setLoading(true))
            const response = await register(email, username, password)
     
            dispatch(setError(null))
        } catch (error) {
            dispatch(setError(error?.message || "Error registering user"))
        } finally {
            dispatch(setRegisteredEmail(email))
            dispatch(setLoading(false))
        }
    }
    const handleGetMe = async () => {
        try {
            dispatch(setLoading(true))
            const response = await getMe()
            dispatch(setUser(response.user))
            dispatch(setError(null))
        } catch (error) {
            dispatch(setError(error?.message || "Error fetching user data"))
        } finally {
            dispatch(setLoading(false))
        }
    }
    const handleVerify = async () => {
        try {
            dispatch((setLoading(true)))
            const verified = await getMe()
            return verified
        }
          catch (error) {
            dispatch(setError(error?.message || "Error fetching user data"))
        } finally {
            dispatch(setLoading(false))
        }

    }
    const handleSocketConnection = ()=>{
            socketConnection()
      }


    return { handleLogin, handleRegister, handleGetMe,handleVerify,handleSocketConnection }

}