import { defineEventHandler, getRouterParams, readBody, tunedErr } from "#imports";
import { Bot, Order } from "~/server/models";
import { IObj } from "~/utils/interfaces";

export default defineEventHandler(async e=>{
    try {
        const {id} = getRouterParams(e)
        const body = await readBody(e)
        let bot = await Bot.findById(id).exec();

        if (!bot) return tunedErr(404, "Bot not found");
        console.log(bot.orders.length);

        for (let oid of bot.orders) {
            console.log(oid);
            const order = await Order.findById(oid);
            if (order) {
                console.log(`DELETING ORDER ` + oid);
                await Order.findByIdAndDelete(oid).exec();
                console.log("Order deleted");
            }
            bot.orders = bot?.orders.filter((el) => el != oid);
            await bot.save();
           
        }
    
        bot = await bot.populate("orders");
        const currAmt = (bot.orders[bot.orders.length - 1] as IObj | undefined)
        ?.ccy_amt;
            return { ...bot.toJSON(), curr_amt: currAmt ?? bot.curr_amt }
    } catch (error) {
        console.log(error);
        return tunedErr(500, "Failed to clear orders")
    }
})