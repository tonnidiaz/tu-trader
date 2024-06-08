import { createSlice } from "@reduxjs/toolkit";
import { IObj } from "@/src/utils/interfaces";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null as IObj | null,
        bots: [] as IObj[]
    },
    reducers: {
        setUser: (state, {payload}) =>{
            state.user = payload
        },
        setBots: (state, {payload}) =>{
            state.bots = payload
        }
    }
})

export const {setUser, setBots} = userSlice.actions
export default userSlice.reducer