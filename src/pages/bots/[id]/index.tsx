import BotFormModal from "@/src/components/BotFormModal";
import TuMeta from "@/src/components/TuMeta";
import TuStat from "@/src/components/TuStat";
import { RootState } from "@/src/redux/store";
import { SITE, api, selectIntervals, selectSymbols } from "@/src/utils/constants";
import { activateBot, toSelectStrategies } from "@/src/utils/funcs";
import { IObj } from "@/src/utils/interfaces";
import Error from "next/error";
import { FC, useEffect, useState } from "react";
import { Checkbox, Stats, Textarea } from "react-daisyui";
import { JSONTree } from "react-json-tree";
import { useSelector } from "react-redux";

interface IProps {
    bot: IObj;
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
export const getServerSideProps = async ({ query }: { query: IObj }) => {
    try {
        const res = await api().get("/bots/" + query.id);

        return { props: { bot: res.data } };
    } catch (e: any) {
        console.log(e);
        const code = e.response?.status ?? 500;
        const _err =
            typeof e.response?.data == "string" &&
            e.response?.data?.startsWith("tuned:")
                ? e.response.data.replace("tuned:", "")
                : "Something went wrong";
        return { props: { err: { code, msg: _err } } };
    }
};

const BotPage: FC<IProps> = ({ bot, err }) => {
    const [_bot, setBot] = useState<IObj>({});
    const [botModal, setBotModal] = useState<HTMLDialogElement>();

    const appStore = useSelector((state: RootState) => state.app);

    useEffect(() => {
        if (bot) setBot(bot);
        console.log(bot);
    }, [bot]);

    useEffect(() => {
        
    }, []);
    return err ? (
        <Error statusCode={err.code} title={err.msg} />
    ) : (
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
                        <div className="stat m-auto">
                            <span className="stat-title">Total orders:</span>
                            <span className="stat-value">
                                {_bot.orders?.length ?? 0}
                            </span>
                        </div>
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
                                        value={_bot.curr_amt ?? 0}
                                    />
                                    <TuStat
                                        title="Interval"
                                        value={`${_bot.interval}m`}
                                    />
                                    <TuStat
                                        title="Strategy"
                                        value={`#${_bot.strategy}`}
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
                            {_bot.orders?.map((el: IObj, i: number) => (
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
                    name: bot.name,
                    desc: bot.desc,
                    demo: bot.demo,
                    id: bot._id,
                    pair: selectSymbols.find(
                        (el) =>
                            el.value.toString() ==
                            [bot.base, bot.ccy].toString()
                    ),
                    strategy: toSelectStrategies(appStore.strategies).find(
                        (el) => el.value == bot.strategy
                    ),
                    interval: selectIntervals.find(
                        (el) => el.value == bot.interval
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
