import axios from "axios";
import { io } from "socket.io-client";
const SITE = "TuTrader";
const __DEV__ = process.env.NODE_ENV == "development";
const ROOT = __DEV__ ? "http://localhost:3000" : "https://tu-trader.vercel.app";
export const BEND_URL = __DEV__
    ? "http://localhost:8000"
    : "https://tu-trader-3996d65ded90.herokuapp.com";
export const EMAIL = "tonnidiazed@gmail.com";
export const DEVELOPER = "Tonni Diaz";
export const SITE_SLOGAN = "A Tunedbass site";
export { SITE, __DEV__, ROOT };
export const symbols = [
    ["BTC", "USDT"],
    ["ETH", "USDT"],
    ["BTC", "ZAR"],
    ["ETH", "ZAR"],
    ["LTC", "USDT"],
    ["USDT", "ZAR"],
    ["XRP", "USDT"],
    ["BNB", "USDT"],
    ["ALGO", "USDT"],
];

export const API = axios.create({ baseURL: BEND_URL });
export const socket = io(BEND_URL, {timeout: 3600000});
socket.on("connect", () => {
    console.log(`IO CONNECTED`);
});
