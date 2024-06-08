import { Bot } from "@/src/server/models";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const bot = await Bot.find().exec()
    // console.log(bot );
    res.status(200).json({msg: "Hello"})
} 
