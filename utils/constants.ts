import axios from "axios";
import bybit_coins from "@/src/data/bybit_coins.json"
import { io } from "socket.io-client";
const SITE = "TuTrader";
const __DEV__ = process.env.NODE_ENV == "development";
const ROOT = __DEV__ ? "http://localhost:3000" : "https://tu-trader.vercel.app";
const heroku = false
export const BEND_URL = __DEV__
    ? "http://localhost:8000"
    : (heroku ? "https://tu-trader-3996d65ded90.herokuapp.com" : "https://xerothermic-jacquelin-tb-org-84c2e6e9.koyeb.app");
export const EMAIL = "tonnidiazed@gmail.com";
export const DEVELOPER = "Tonni Diaz";
export const SITE_SLOGAN = "A Tunedbass site";
export { SITE, __DEV__, ROOT };

export const STORAGE_KEYS = {authTkn: "TB_AUTH_TOKEN"}
export const pagesWithLayout : string[] = ["/auth/login", "/auth/logout", "/auth/signup"]
export const symbols =true ? bybit_coins:[
    ["BTC", "USDT"],
    ["ETH", "USDT"],
    ["SOL", "USDT"],
    ["DOGE", "USDT"],
    ["EUR", "USDT"],
    ["USDT", "ZAR"],
    ["OKB", "USDT"],
    ["MATIC", "USDT"],
    ["XRP", "USDT"],
    ["BNB", "USDC"],
    ["PEPE", "USDT"],
    ["CEL", "USDT"],
    ["PEOPLE", "USDT"],
    ["CORE", "USDT"],
    ["1INCH", "USDT"],
    ["AAVE", "USDT"],
    ["ACA", "USDT"],
    ["ACE", "USDT"],
    ["ACH", "USDT"],
    ["ADA", "USDT"],
    ["AERGO", "USDT"],
    ["AEVO", "USDT"],
    ["AGIX", "USDT"],
    ["AGLD", "USDT"],
    ["AIDOGE", "USDT"],
    ["AKITA", "USDT"],
    ["ALCX", "USDT"],
    ["ALGO", "USDT"],
    ["ALPHA", "USDT"],
    ["ANT", "USDT"],
    ["APE", "USDT"],
    ["API3", "USDT"],
    ["APM", "USDT"],
    ["ETH", "BTC"],
    ["OKB", "BTC"],
    ["MATIC", "BTC"],
    ["XRP", "BTC"],
    ["SOL", "BTC"],
    ["DOGE", "BTC"],
    ["AAVE", "BTC"],
    ["ADA", "BTC"],
    ["ATOM", "BTC"],
    ["AVAX", "BTC"],
    ["BCH", "BTC"],
    ["BSV", "BTC"],
    ["CHZ", "BTC"],
    ["CRO", "BTC"],
    ["CRV", "BTC"],
    ["DOT", "BTC"],
    ["EOS", "BTC"],
    ["ETC", "BTC"],
    ["FIL", "BTC"],
    ["GRT", "BTC"],
    ["HBAR", "BTC"],
    ["LINK", "BTC"],
    ["LTC", "BTC"],
    ["MANA", "BTC"],
    ["MKR", "BTC"],
    ["NEAR", "BTC"],
    ["NEO", "BTC"],
    ["OKT", "BTC"],
    ["QTUM", "BTC"],
    ["SHIB", "BTC"],
    ["STX", "BTC"],
    ["TRX", "BTC"],
    ["UNI", "BTC"],
    ["WBTC", "BTC"],
    ["XCH", "BTC"],
    ["XLM", "BTC"],
    ["OKB", "ETH"],
    ["XRP", "ETH"],
    ["SOL", "ETH"],
    ["DOGE", "ETH"],
    ["ADA", "ETH"],
    ["ATOM", "ETH"],
    ["BETH", "ETH"],
    ["EOS", "ETH"],
    ["FIL", "ETH"],
    ["LINK", "ETH"],
    ["LTC", "ETH"],
    ["OKT", "ETH"],
    ["STETH", "ETH"],
    ["TRX", "ETH"]
]
export const intervals = [5, 15, 30, 60]
export const selectIntervals = intervals.map((e) => ({
    label: `${e}m`, 
    value: e,
}))

export const selectSymbols = symbols.sort().map((e) => ({
    label: e.join("/"),
    value: e.toString(),
}))


export const socket = io(BEND_URL, {auth: {username: 'tonnidiaz',}, timeout: 100 * 10000000});
socket.on("connect", () => {
    console.log(`IO CONNECTED`);
});



export const selectPlatforms = (lst: string[]) => lst.map((el, i)=>({label: el.toUpperCase(), value: i}))