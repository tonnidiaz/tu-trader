import { Bot, User } from "~/server/models";

export default defineEventHandler(async (e) => {
    try {
        console.log("GETTING BOTS...");
        const query = getQuery(e);
        const username = query.user;
        const user = username ? await User.findOne({ username }).exec() : null;
        if (username && !user) return tunedErr(404, "Page not found");
        const bots = user
            ? await Bot.find({ user: user.id }).exec()
            : await Bot.find().exec();
        return bots.map((e) => e.toJSON());
    } catch (error) {
        console.log(error);
        return tunedErr(500);
    }
});
