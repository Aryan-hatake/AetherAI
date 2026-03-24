import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
import { useChat } from "../../../chat/hooks/useChat";
import { socket } from "../../sockets/auth.socket";
export default function Protected({ children }) {

    const loading = useSelector(state => state.auth.loading)
    const user = useSelector(state => state.auth.user)
    
      
    const {handleGetMe,handleSocketConnection} = useAuth()
    
    useEffect(()=>{   
        async function getMe() {    
          await handleGetMe()
        }
        getMe()

      },[])

  useEffect(()=>{

      if(user){
      
          handleSocketConnection()
          console.log("connecting to socket...")
        }
        else{
            socket.disconnect()
            console.log("user not available for socket connection")
        }
    },[user])


    if (loading) {
        return (
            <h1>Loading...</h1>
        )
    }
   
    if (!user) {
      
        return <Navigate to={"/login"}  replace />
    }
    return (

        children

    )
}