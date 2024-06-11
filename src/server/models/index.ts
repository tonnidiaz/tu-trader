import { InferSchemaType, model } from "mongoose";
import {  IUser, UserSchema } from "./user"
import { BotSchema, IBot } from "./bot";
import { IOrder, OrderSchema } from "./order";
import mongoose  from "mongoose";

console.log("CREATING DB...");
const User : IUser = mongoose.models?.User || model("User", UserSchema, )
const Bot : IBot= mongoose.models?.Bot || model("Bot", BotSchema,  )
const Order: IOrder = mongoose.models?.Order ||  model("Order", OrderSchema, )

export { User, Bot, Order }
