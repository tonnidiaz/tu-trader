/** @type {import('next').NextConfig} */

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
  }
  (async function(){await connectMongo()})() */
export default nextConfig;
