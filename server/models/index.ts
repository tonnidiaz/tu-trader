import { model } from "mongoose";
import {  UserSchema } from "./user"
import { BotSchema } from "./bot";
import { OrderSchema } from "./order";

console.log("CREATING DB...");

const User  =model<typeof UserSchema>("User", UserSchema, )
const Bot=model("Bot", BotSchema,  )
const Order =  model("Order", OrderSchema, )


export { User, Bot, Order }
