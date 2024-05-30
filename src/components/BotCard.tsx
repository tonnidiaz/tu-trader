import { Avatar } from "react-daisyui";
import { IObj } from "../utils/interfaces";
import React from "react";
import NextLink from "next/link";
import TuDropdownBtn from "./TuDropdownBtn";
import { api } from "../utils/constants";
import { sleep } from "../utils/funcs";
interface IProps {
    bot: IObj;
    updateBot: (bot: IObj) => void;
}

const BotCard: React.FC<IProps> = ({ bot, updateBot }) => {

    const activateBot = async (e: any) => {
        const el = e.target.parentElement 
        try {
            //console.log(e);
            //e.preventDefault()
            
            el.innerHTML = `<span class="loading loading-dots loading-sm m-auto"></span>`
            const val = !bot.active;
            await sleep(2000)
            const res = await api().post(`/bots/${bot.id}/edit}`, {
                field: "active",
                val: val,
            });
            updateBot(res.data);
            return true;
        } catch (err) {
            console.log(err);
            el.innerHTML = `<span>${bot.active ? "Deactivate" : "Activate"}</span>`
            return false;
        }
    };

    return (
        <NextLink
            href={`/bots/${bot.id}`}
            className="border-1 border-card bg-base-200 p-4 br-10 bot-card"
        >
            <div className="flex gap- justify-between">
                <div className="flex gap-4  overflow-hidden">
                    <div>
                        <Avatar
                            online={bot.active}
                            offline={!bot.active}
                            borderColor="neutral"
                            shape="circle"
                            innerClassName="ring relative w-35px h-35px flex items-center justify-center"
                        >
                            <span>
                                <i className="fi fi-br-user-robot"></i>
                            </span>
                        </Avatar>
                    </div>
                    <div className="overflow-hidden">
                        <h4 className="text-gray-200 fw-6">{bot.name}</h4>
                        <h6 className="fs-11 fw-6 text-gray-300">
                            {bot.base}/{bot.ccy}
                        </h6>
                        <div className="mt-1 overflow-hidden">
                            <p
                                className="fs-13"
                                style={{
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    flexGrow: 0,
                                }}
                            >
                                {bot.desc}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="">
                    <TuDropdownBtn
                        toggler={
                            <button className="btn btn-ghost btn-circle fs-20 fw-7">
                                <span>
                                    <i className="fi fi-rr-circle-ellipsis"></i>
                                </span>
                            </button>
                        }
                        items={[
                            {
                                child: (
                                    <span>
                                        {bot.active ? "Deactivate" : "Activate"}
                                    </span>
                                ),
                                onTap: activateBot,
                            },
                            {child: <span>Hellow world!</span>, onTap: (e)=>{}}
                        ]}
                    />
                </div>
            </div>
        </NextLink>
    );
};
export default BotCard;
