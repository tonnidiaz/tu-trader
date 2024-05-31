import { createSlice } from "@reduxjs/toolkit";
import { IObj } from "@/src/utils/interfaces";

const appSlice = createSlice({
    name: "app",
    initialState: {
        strategies: [] as IObj[],
        ready: false
    },
    reducers: {
        setStrategies: (state, {payload}) =>{
            state.strategies = payload
        },
        setReady: (state, {payload})=>{
            state.ready = payload
        }
    }
})

export const { setStrategies, setReady} = appSlice.actions
export default appSlice.reducer