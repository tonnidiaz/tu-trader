import { defineEventHandler, getRequestURL } from "#imports";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { IE } from "../interfaces";
import { IUser } from "../models/user";
 
export default defineEventHandler(async (e: IE) => {

    console.log("AUTH MIDDLEWARE");
    const headers = getHeaders(e);
    const authTkn = headers.authorization?.split(" ")[1];
    
    if (authTkn) {
        try {
            const { payload } = jwt.verify(
                authTkn,
                process.env.SECRET_KEY!
            ) as IObj;
            if (payload?.id) {
                const user  = await User.findById(payload.id).exec();
                e.user = user as IUser;
            }
        } catch (e) {
            console.log(e);
        }
    }
});
