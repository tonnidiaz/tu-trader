"use client"
import BotFormModal from "@/src/components/BotFormModal";
import TuMeta from "@/src/components/TuMeta";
import TuStat from "@/src/components/TuStat";
import { RootState } from "@/src/redux/store";
import {
    SITE,
    api,
    selectIntervals,
    selectSymbols,
} from "@/src/utils/constants";
import { activateBot, toSelectStrategies } from "@/src/utils/funcs";
import { IObj } from "@/src/utils/interfaces";
import Error from "next/error";
import { FC, useEffect, useState } from "react";
import { Checkbox, Stats, Textarea } from "react-daisyui";
import { JSONTree } from "react-json-tree";
import { useSelector } from "react-redux";

interface IProps {
    bot?: IObj;
    err?: IObj;
}
const theme = {
    scheme: "monokai",
    author: "Tonni Diaz",
    base00: "#1d232a",
    base01: "#383830",
    base02: "#49483e",
    base03: "#75715e",
    base04: "#a59f85",
    base05: "#f8f8f2",
    base06: "#f5f4f1",
    base07: "#f9f8f5",
    base08: "#f92672",
    base09: "#fd971f",
    base0A: "#f4bf75",
    base0B: "#a6e22e",
    base0C: "#a1efe4",
    base0D: "#66d9ef",
    base0E: "#ae81ff",
    base0F: "#cc6633",
};


enum EOrder {all, win, lose}

const BotPage: FC<IProps> = ({ bot, err }) => {

    if (!bot && err){
        return  <Error statusCode={err.code} title={err.msg} />
    }
    const [_bot, setBot] = useState<IObj>({});
    const [botModal, setBotModal] = useState<HTMLDialogElement>();
    const [orders, setOrders] = useState<IObj[]>([]);
    const [orderType, setOrderType] = useState<EOrder>(EOrder.all)
    const appStore = useSelector((state: RootState) => state.app);

    useEffect(() => {
        if (bot) {
            setBot(bot);
            if(bot.orders)
            setOrders(bot.orders.filter(el=> orderType == EOrder.win ? el.prifit > 0 : orderType == EOrder.lose ? el.profit < 0 : true ))
        }
    }, [bot]);

    useEffect(() => {
        if (_bot.orders)
        setOrders(_bot.orders.filter(el=> orderType == EOrder.win ? el.profit > 0 : orderType == EOrder.lose ? el.profit < 0 : true ))

    }, [orderType]);

    useEffect(()=>{
        console.log(_bot);
    }, [_bot])

    useEffect(()=>{
        console.log("MOUNTED", bot, _bot);
    },[])
    return (
        <div className="md:p-5 p-1">
            <TuMeta title={`Bot: ${_bot.name} - ${SITE}`} />

            <fieldset className="formset border-card border-1 p-2 md:p-4">
                <legend>
                    <h1 className="text-gray-200">{_bot.name}</h1>
                </legend>
                <div className="flex gap-4 justify-center items-center">
                    <span className="fw-8">
                        {_bot.base}/{_bot.ccy}
                    </span>{" "}
                    {_bot.active ? (
                        <div className="badge badge-success">Active</div>
                    ) : (
                        <div className="badge badge-warning">Paused</div>
                    )}
                </div>
                <div className="flex gap-4 justify-center mt-3 items-center">
                    <button
                        onClick={(e) =>
                            activateBot(e.currentTarget, _bot, setBot)
                        }
                        className="btn btn-neutral btn-sm"
                    >
                        {_bot.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                        className="btn btn-sm btn-rounded btn-neutral"
                        title="Modify"
                        onClick={(_) => botModal?.showModal()}
                    >
                        <span>
                            <i className="fi fi-br-pencil"></i>
                        </span>
                    </button>
                </div>
                <div className="mt-">
                    <div className="stats text-center flex">
                        <TuStat
                            value={
                                _bot.orders?.filter((el) => el.profit < 0)
                                    ?.length ?? 0
                            }
                            titleClasses={orderType == EOrder.lose ?"text-white": ""}
                            valClasses={orderType == EOrder.lose ?"text-white": ""}
                            onClick={()=>setOrderType(EOrder.lose)}
                            title="L:"
                        />
                        <TuStat
                            value={_bot.orders?.length ?? 0}
                            title="Total orders:"
                            onClick={()=>setOrderType(EOrder.all)}
                        />
                        <TuStat
                            value={
                                _bot.orders?.filter((el) => el.profit > 0)
                                    ?.length ?? 0
                            }
                            titleClasses={orderType == EOrder.win ?"text-white": ""}
                            valClasses={orderType == EOrder.win ?"text-white": ""}
                            onClick={()=>setOrderType(EOrder.win)}
                            title="W:"
                        />
                    </div>
                    <div>
                        <details className="collapse collapse-arrow border border-card bg-base-100">
                            <summary className="collapse-title text-xl font-medium">
                                More details
                            </summary>
                            <div className="collapse-content">
                                <div className="form-group flex items-center gap-3 justify-center">
                                    <label htmlFor="demo" className="label">
                                        Demo mode
                                    </label>
                                    <Checkbox
                                        id="demo"
                                        checked={_bot.demo}
                                        readOnly
                                    />
                                </div>
                                <div className="shadow grid grid-cols-2">
                                    <TuStat
                                        title="Start amount"
                                        value={_bot.start_amt ?? 0}
                                    />
                                    <TuStat
                                        title="Current amount"
                                        value={`${(_bot.curr_amt ?? 0).toFixed(
                                            2
                                        )}`}
                                    />
                                    <TuStat
                                        title="Interval"
                                        value={`${_bot.interval}m`}
                                    />
                                    <TuStat
                                        title="Strategy"
                                        valClasses="wp-wrap"
                                        value={
                                            appStore.strategies[
                                                _bot.strategy - 1
                                            ]?.name
                                        }
                                    />
                                </div>
                                <div className="mt-1">
                                    <Textarea
                                        placeholder="Description..."
                                        readOnly
                                        value={_bot.desc}
                                    />
                                </div>
                            </div>
                        </details>
                    </div>
                    <fieldset className="formset border-1 border-card  p-2 mt-2">
                        <legend>Orders</legend>
                        <div className="mt-2 overflow-y-scroll">
                            {orders.map((el: IObj, i: number) => (
                                <div key={`item-${i * 1}`}>
                                    <JSONTree
                                        theme={theme}
                                        keyPath={["Order"]}
                                        data={el}
                                        shouldExpandNodeInitially={(k, d, l) =>
                                            false
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </fieldset>
                </div>
            </fieldset>

            <BotFormModal
                fd={{
                    name: _bot.name,
                    desc: _bot.desc,
                    demo: _bot.demo,
                    id: _bot._id,
                    pair: selectSymbols.find(
                        (el) =>
                            el.value.toString() ==
                            [_bot.base, _bot.ccy].toString()
                    ),
                    strategy: toSelectStrategies(appStore.strategies).find(
                        (el) => el.value == _bot.strategy
                    ),
                    interval: selectIntervals.find(
                        (el) => el.value == _bot.interval
                    ),
                }}
                setRef={setBotModal}
                mode="Edit"
                onDone={(bot) => setBot(bot)}
            />
        </div>
    );
};

export default BotPage;
