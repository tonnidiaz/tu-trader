import { defineEventHandler, getQuery } from "#imports";
import { tunedErr } from "../utils/functions";

export default defineEventHandler(async e=>{
    try {
        const query = getQuery(e)
    } catch (error) {
        console.log(error);
        return tunedErr()
    }
})