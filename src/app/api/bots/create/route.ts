import { tunedErr } from "@/src/server/utils/functions";
import { IRequest } from "@/src/server/utils/interfaces";

export async function POST(req:IRequest) {
    try {
        console.log(req.user);
        return Response.json("OK")
    } catch (error) {
        console.log(error);
        return tunedErr()
    }
}