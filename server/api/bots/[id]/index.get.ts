import { defineEventHandler, getRouterParams, tunedErr } from "#imports";
import { Bot } from "~/server/models";
import { parseDate } from "~/utils/funcs";
import { IObj } from "~/utils/interfaces";

export default defineEventHandler(async (e) => {
    try {
        const { id } = getRouterParams(e);

        let bot = await Bot.findById(id).exec();
        if (!bot) return tunedErr(404, "Bot not found");

        bot = await bot.populate("orders");
        const currAmt = (bot.orders[bot.orders.length - 1] as IObj | undefined)
            ?.ccy_amt;
        const data: IObj = {
            ...bot.toJSON(),
            curr_amt: currAmt ?? bot.curr_amt,
        };

        data.orders = data.orders.map((el) => ({
            ...el,
            buy_timestamp: {
                i: parseDate(el.buy_timestamp?.i),
                o: parseDate(el.buy_timestamp?.o),
            },
            sell_timestamp: {
                i: parseDate(el.sell_timestamp?.i),
                o: parseDate(el.sell_timestamp?.o),
            },
        }));

        return data;
    } catch (error) {
        console.log(error);
        return tunedErr();
    }
});
