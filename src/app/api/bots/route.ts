import { Bot, User } from "@/src/server/models";
import { tunedErr } from "@/src/server/utils/functions";
import { NextApiResponse } from "next";

export async function GET(req: Request, res: NextApiResponse){
    try {
        const { searchParams} = new URL(req.url)
        const username = searchParams.get('user')
        const user = username ? await User.findOne({ username }).exec() : null;
        if (username && !user) return tunedErr(404, "Bot not found");
        const bots = user
            ? await Bot.find({ user: user.id }).exec()
            : await Bot.find().exec();
            
        return Response.json(bots.map((e) => e.toJSON()))
    } catch (error) {
        return tunedErr(500)
    }
}