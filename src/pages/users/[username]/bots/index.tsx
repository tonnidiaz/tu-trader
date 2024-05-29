import BotCard from "@/src/components/BotCard";
import TuMeta from "@/src/components/TuMeta";
import { SITE } from "@/src/utils/constants";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Avatar } from "react-daisyui";

const tetsBots = [
    {name: "Bot 1", desc: "Does what bot 1 does hommie. The hell!", ccy: "USDT", base: "BTC", id: "ssddaw",},
    {name: "Bot 2", desc: "Does what bot 2 does hommie. The hell!", ccy: "USDT", base: "ETH", id: "ssddaw",},
    {name: "Bot 3", desc: "Does what bot 3 does hommie. The hell!", ccy: "USDT", base: "SOL", id: "ssddaw",},
    {name: "Bot 4", desc: "Does what bot 4 does hommie. The hell!", ccy: "USDT", base: "XRP", id: "ssddaw",},
    {name: "Bot 5", desc: "Does what bot 5 does hommie. The hell!", ccy: "USDT", base: "DODGE", id: "ssddaw",},
    {name: "Bot 6", desc: "Does what bot 6 does hommie. The hell!", ccy: "USDT", base: "BTP", id: "ssddaw",},
]

export default function UserBotsPage(){
    const router = useRouter()
    useEffect(()=>{
    }, [])
    return <>
    <TuMeta title={`${router.query.username}'s bots - ${SITE}`}/>
    <div className="p-5">
        <h1 className="text-xl text-gray-200">My bots</h1>
        <div className="mt-5">
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
                {tetsBots.map((e, i)=> <BotCard bot={e} key={`item-${i * 1}`}/>)}
            </div>
        </div>
        <button className="btn btn-md btn-primary btn-circle fab"><i className="fi fi-rr-plus"></i></button>
    </div></> 
}