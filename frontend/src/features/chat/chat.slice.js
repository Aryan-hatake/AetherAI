import { createSlice } from "@reduxjs/toolkit";
import { TruckElectricIcon } from "lucide-react";

export const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: [],
        chatMsg: {},
        activeChatId: null,
        error: null,
        loading: false
    },
    reducers: {
        setChats: (state, action) => {
            const backendChats = action.payload
            const existingIds = new Set(state.chats.map(chat => chat._id))

            const newChats = backendChats.filter(chat => !existingIds.has(chat._id))

            newChats.forEach(chat => {
                state.chats.push({ ...chat, active: false })
            });

        },
        setChatMsg: (state, action) => {
            const msgArr = action.payload
            state.chatMsg[state.activeChatId] = msgArr
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setActiveChatId: (state, action) => {
            state.activeChatId = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setDummy: (state, action) => {   
            state.chats.push({ _id: 999, title: "loading", active: true })
            state.chatMsg['999'] = []
        },
        setAddMsg: (state, action) => {
            let obj = action.payload


            let oldChats = [...state.chatMsg[state.activeChatId]]
            state.chatMsg[state.activeChatId] = [...oldChats, obj]
        },
        setUpdateDummy: (state, action) => {
            const { title, chat } = action.payload
            // console.log(title , chat)

            // console.log(state.chats)
            state.chats.forEach((c) => {
                if (c._id === 999) {
                    c._id = chat
                    c.title = title
                }
            })
            // console.log("after", state.chats)
            state.chatMsg[chat] = state.chatMsg[999]
            delete state.chatMsg[999]
            
            // console.log("after chatmsg", JSON.parse(JSON.stringify(state.chatMsg)))

        }


    }

})

export const { setChats, setChatMsg, setError, setLoading, setActiveChatId, setAddMsg, setDummy, setUpdateDummy,activeChatId } = chatSlice.actions
export default chatSlice.reducer