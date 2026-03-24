import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../features/auth/slices/user.slice'
import chatReducer from '../features/chat/chat.slice'

export const store = new configureStore({
    reducer:{
       auth:authReducer,
       chat:chatReducer
    }
})