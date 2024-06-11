import {  NextResponse } from "next/server";
import { IObj } from "./utils/interfaces";
import { Bot, User } from "./server/models";
import { IRequest } from "./server/utils/interfaces";
import { IUser } from "./server/models/user";
import { connectDb } from "./server/utils/db";
import { jwtVerify } from "jose";

const authenticator = async (req : IRequest, isRequired: boolean)=>{
    const  authorization = req.headers.get("Authorization");
    if (authorization) {
        const tkn = authorization.split(" ")[1];      
     if (tkn){
         try {
            console.log(process.env.SECRET_KEY);
            const {payload} =(await  jwtVerify(tkn, new TextEncoder().encode(process.env.SECRET_KEY!))).payload as IObj;
            console.log(payload);
            if (payload?.id){
                console.log(Bot.find);
                //const user  =  await User.findById(payload.id).exec()
                req.user = null
            }
        } catch (e) {
            console.log(e)
        }
      }
       
    } else {
        console.log("Not authenticated")
    }
    if (!req.user && isRequired) return Response.json("tuned:Not authenticated!" , {status: 401});
    NextResponse.redirect(req.nextUrl)
}

export async function middleware (req: IRequest){
    console.log("Middleware...");
   return await authenticator(req, true)
}

export const config = {
    matcher: ['/api/bots/create', '/dashboard/:path*'],
  }