"use server"
import { __DEV__ } from "@/src/utils/constants";
import mongoose, { ConnectOptions } from "mongoose";
const mng = require("mongoose");

declare global {
  var mongoose: any; // This must be a `var` and not a `let / const`
} 

/* const MONGO_URI = (__DEV__ ? process.env.MONGO_URL_LOCAL : process.env.MONGO_URL )

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local",
  );
}
 */
/* let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
 */
async function connectDb() {
/*     console.log("CONNECTING MONGO...");
    console.log(mongoose.connect);
    const opts : ConnectOptions= {
        bufferCommands: false,
        dbName: "tb"
      };
    mongoose.connect(MONGO_URI!, opts).then((mongoose) => {
        console.log("MONGO CONNECTED");
      return mongoose;
    }); */
    return
/*   if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts : ConnectOptions= {
      bufferCommands: false,
      dbName: "tb"
    };
    cached.promise = mongoose.connect(MONGO_URI!, opts).then((mongoose) => {
        console.log("MONGO CONNECTED");
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn; */
}

export  {connectDb};