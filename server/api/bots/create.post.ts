import { Bot, User } from "~/server/models";

export default defineEventHandler(async e=>{
    try {
        const body = await readBody(e)
        const bot = new Bot();
        for (let k of Object.keys(body)) {
            bot.set(k, body[k]);
        };
        
        [bot.base, bot.ccy] = body.pair;
        const user = await User.findOne({ username: body.user }).exec();
        if (!user) return tunedErr(400, "User account does not exist");
        bot.user = user.id;
        await bot.save();
        user.bots.push(bot.id);
        await user.save();
        return bot.toJSON()
    } catch (error) {
        console.log(error);
        return tunedErr()
    }
})