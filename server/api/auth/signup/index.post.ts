import { User } from "~/server/models";
import bcrypt from 'bcrypt'
import { __DEV__ } from "~/utils/constants";
import { defineEventHandler, readBody, getQuery, genToken, tunedErr, randomInRange, getStoreDetails, sendMail, UserPermissions } from "#imports";

const importantEmails = [
    "tonnidiazed@gmail.com",
    "clickbait4587@gmail.com",
    "openbytes@yahoo.com",
    "nyandenilebohang@gmail.com",
    "squashetonics@gmail.com",
];

export default defineEventHandler(async e=>{
    try {
        const body = await readBody(e)
        const query = getQuery(e)

        if (query.act == "complete") {
            const user = await User.findOne({ email: body.email }).exec();
            for (let k of Object.keys(body)) {
                if (k != "password") {
                    user!.set(k, body[k]);
                }
            }
            await user!.save();
            const token = genToken({ id: user!._id });
            return { token };
        }

        // Delete existing user with unverified email
        await User.findOneAndDelete({
            email: body.email,
            email_verified: false,
        }).exec();

        if (
            await User.findOne({
                email: body.email,
                email_verified: true,
            }).exec()
        )
            return tunedErr(400,
                "User already with same email already exists"
            );

        if (
            await User.findOne({
                username: body.username,
                email_verified: true,
            }).exec()
        )
            return tunedErr(
                400,
                "User already with same username already exists"
            );

        const user = new User();
        for (let key of Object.keys(body)) {
            if (key == "password") {
                user.password = bcrypt.hashSync(body.password, 10);
            } else {
                user[key] = body[key];
            }
        }
        const otp = randomInRange(1000, 9999);
        if (__DEV__) {
            console.log(otp);
        }
        const meta = getStoreDetails();
        user.otp = otp;

        await sendMail(
            meta.store.name + " Verification Email",
            `<h2 style="font-weight: 500; font-size: 1.2rem;">Here is your signup verification OTP:</h2>
                    <p style="font-size: 20px; font-weight: 600">${user.otp}</p>
                `,
            user.email
        );


        // const smsRes = await sendSMS(number, `Tukoffee - your code is: ${otp}`)
        //console.log(smsRes.data)
        if (importantEmails.indexOf(user.email) != -1)
            user.permissions = UserPermissions.delete;

        console.log(user.password);
        await user.save();
        return "Signup successfull"
    } catch (error) {
        console.log(error);
        return tunedErr()
    }
})