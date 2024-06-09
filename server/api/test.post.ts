import { defineEventHandler, readBody } from "#imports";
import { tunedErr } from "../utils/functions";

export default defineEventHandler(async e=>{
    try {
        const body = await readBody(e)
    } catch (error) {
        console.log(error);
        return tunedErr()
    }
})