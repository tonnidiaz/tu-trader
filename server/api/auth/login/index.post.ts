import { defineEventHandler, readBody, tunedErr } from "#imports";
import { IE } from "~/server/interfaces";
import { User } from "~/server/models";
import bcrypt from "bcrypt";

export default defineEventHandler(async (e: IE) => {
    try {
        const body = await readBody(e);
        const { username, password } = body;

        if (e.user && !password) {
            //Loging in with token
            return { user: { ...e.user.toJSON() } };
        } else if (username && password) {
            const q = isEmail(username) ? { email: username } : { username };
            let user = await User.findOne(q).exec();
            if (user) {
                const passValid = bcrypt.compareSync(password, user.password);

                if (!passValid) return tunedErr(401, "Incorrect password");
                const token = genToken({ id: user._id });
                return { user: { ...user.toJSON() }, token };
            } else return tunedErr(400, "Account does not exist");
        } else {
            return tunedErr(400, "Provide all fields");
        }
        return "OK";
    } catch (error) {
        console.log(error);
        return tunedErr();
    }
});
