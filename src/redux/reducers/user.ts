import { createSlice } from "@reduxjs/toolkit";
import { IObj } from "@/src/utils/interfaces";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null as IObj | null
    },
    reducers: {
        setUser: (state, {payload}) =>{
            state.user = payload
        }
    }
})

export const {setUser} = userSlice.actions
export default userSlice.reducer