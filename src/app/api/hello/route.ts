import { Bot } from "@/src/server/models";
import { IBot } from "@/src/server/models/bot";
import { connectDb } from "@/src/server/utils/db";

export async function GET(b: IBot) {
    await connectDb()
    const bots = await Bot.find().exec()
    return Response.json({  });
  }  