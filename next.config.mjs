/** @type {import('next').NextConfig} */
import mongoose from 'mongoose';

const usersPaths = ["", "/bots", "/bots/:id"];
const nextConfig = {
    async rewrites() {
        return [
            ...usersPaths.map((el) => ({
                source: "/@:username" + el,
                destination: "/users/:username" + el,
            })),
        ];
    },

    experimental: {
        esmExternals: "loose", // <-- add this
        serverComponentsExternalPackages: ["mongoose"], // <-- and this
      },
      // and the following to enable top-level await support for Webpack
      webpack: (config) => {
        config.experiments = {
          topLevelAwait: true,
          layers: true
        };
        return config;
      },
};

let init = false

/* import mongoose from 'mongoose';
export const DEV = process.env.ENV == 'dev'
async function connectMongo(){ 
    console.log(init);
    if (init) return
    init = true
    let mongoURL = (DEV ? process.env.MONGO_URL_LOCAL : process.env.MONGO_URL )
    try {
        console.log(mongoURL);
      await mongoose.connect(mongoURL, {dbName: "tb"});
      console.log('Connection established'); 
    }
    catch(e) {
      console.log('Could not establish connection')
     console.log(e); 
    }
  }*/
  //(async function(){await connectDb()})() 

  const __DEV__ = process.env.NODE_ENV == "development"

  const MONGO_URI = (__DEV__ ? process.env.MONGO_URL_LOCAL : process.env.MONGO_URL )

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local",
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

(async function connectDb() {
    console.log("CONNECTING MONGO...");

  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "tb"
    };
    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
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

  return cached.conn;
})()
export default nextConfig;
