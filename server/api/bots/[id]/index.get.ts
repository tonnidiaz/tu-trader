import { defineEventHandler, getRouterParams, tunedErr } from "#imports";
import { Bot } from "~/server/models";
import { IObj } from "~/utils/interfaces";

export default defineEventHandler(async e=>{
    try {
        const {id} = getRouterParams(e)

        let bot = await Bot.findById(id).exec();
        if (!bot) return tunedErr(404, "Bot not found");

        bot = await bot.populate("orders");
        const currAmt = (bot.orders[bot.orders.length - 1] as IObj | undefined)
            ?.ccy_amt;

        return { ...bot.toJSON(), curr_amt: currAmt ?? bot.curr_amt };
    } catch (error) {
        console.log(error);
        return tunedErr()
    }
})