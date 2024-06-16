import { defineEventHandler, getRouterParams, readBody, tunedErr } from "#imports";
import { Bot } from "~/server/models";

export default defineEventHandler(async e=>{
    try {
        const {id} = getRouterParams(e)
        const fd = await readBody(e)

        const bot = await Bot.findById(id).exec();
        if (!bot) return tunedErr(404, "Bot not found");

        const { key, val } = fd;

        if (key == "active") {
            bot.set(key, val);
            console.log("DONE ADDING/PAUSING JOB");
        } else if (key == "multi") {
            for (let k of Object.keys(val)) {
                const v = val[k];

                if (k == "symbol") {
                    bot.set("base", v[0]);
                    bot.set("ccy", v[1]);
                }
                bot.set(k, v);
            }
        }
        await bot.save();
       return (await bot.populate("orders")).toJSON();
    } catch (error) {
        console.log(error);
        return tunedErr()
    }
})