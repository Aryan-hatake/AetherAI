import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        user:null,
        loading:false,
        error:null,
        token:null,
        registeredEmail:null
    },
    reducers:{
        setUser:(state,action)=>{
            state.user = action.payload
        },
        setLoading:(state,action)=>{
            state.loading = action.payload
        },
        setError:(state,action)=>{
            state.error = action.payload
        },
        setToken:(state,action)=>{
            state.token = action.payload
        },
        setRegisteredEmail:(state,action)=>{
            state.registeredEmail = action.payload
        }
    }
})

export const  {setError,setUser,setLoading,setToken,setRegisteredEmail}  = userSlice.actions
export default userSlice.reducer
