import { Avatar } from "react-daisyui";
import { IObj } from "../utils/interfaces";
import React from "react";
import NextLink from 'next/link'
interface IProps {bot: IObj}

const BotCard  : React.FC<IProps> = ({bot})=> {
    return (
        <NextLink href={`/bots/${bot.id}`} className="border-1 border-card bg-base-200 p-4 br-10 bot-card">
            <div className="flex gap- justify-between">
                <div className="flex gap-4  overflow-hidden">
                    <div>
                    <Avatar
                        online
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
                        <h6 className="fs-11 fw-6 text-gray-300">{bot.base}/{bot.ccy}</h6>
                        <div className="mt-1 overflow-hidden">
                            <p
                            className="fs-13"
                                style={{
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    flexGrow: 0,
                                }}
                            >{bot.desc}</p>
                        </div>
                    </div>
                </div>
                <div className="">
                    <button className="btn btn-ghost btn-circle fs-20 fw-7">
                        <span>
                            <i className="fi fi-rr-circle-ellipsis"></i>
                        </span>
                    </button>
                </div>
            </div>
        </NextLink>
    );
}
export default BotCard