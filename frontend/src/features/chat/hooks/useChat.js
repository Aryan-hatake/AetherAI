import { useDispatch, useSelector } from "react-redux";
import { sendMessage, getChats, getMessages } from "../services/chat.api";
import { setChatMsg, setChats, setError, setLoading, setActiveChatId, setAddMsg, setDummy, setUpdateDummy } from "../chat.slice";
import { prompt } from "../sockets/chat.socket";

export function useChat() {

    const dispatch = useDispatch()
    const chatMsg = useSelector(state => state.chat.chatMsg)
    const activeChat = useSelector(state => state.chat.activeChatId)
    const handleGetChats = async () => {
        dispatch(setLoading(true))
        try {
            const data = await getChats()
            const chatArr = data.allChats
            dispatch(setChats(chatArr))

        }
        catch (err) {
            dispatch(setError(err))
        }
        finally {
            dispatch(setLoading(false))
        }
    }


    const handleChatMsg = async (chatId) => {
        dispatch(setLoading(true))
        try {
            dispatch(setActiveChatId(chatId))
            const data = await getMessages(chatId);
            dispatch(setChatMsg(data.allMessage))
        }
        catch (err) {
            dispatch(setError(err))
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    const handlePrompt = (msg, chat) => {
        dispatch(setLoading(true))
        try {

            
            if (!chat) {
                chat = 999
                dispatch(setDummy(msg))
                dispatch(setActiveChatId(chat))
            }

            let tempId = Date.now()
            let user = {
                _id: tempId,
                content: msg,
                role: "user",
                updatedAt: new Date().toISOString()
            }
            dispatch(setAddMsg(user))
            chat===999 ? prompt(msg) : prompt(msg,chat)

        }
        catch (err) {
            console.log(err)
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    const handleAIResponse = (res, chatId) => {
        try {
            dispatch(setLoading(true))

            const { title, chat , response } = res
            
         
            if (chatId === 999) {
                dispatch(setActiveChatId(chat))
                dispatch(setUpdateDummy({ title, chat }))
            }

            const tempId = Date.now()

            const ai = {
                _id: tempId,
                content: response,
                role: "ai",
                updatedAt: new Date().toISOString()
            }

            dispatch(setAddMsg(ai))

        }
        catch (err) {
            dispatch(setError(err))
        }
        finally {
            dispatch(setLoading(false))
        }
    }







    return { handleChatMsg, handleGetChats, handlePrompt , handleAIResponse }
}

