import BotCard from "@/src/components/BotCard";
import TuMeta from "@/src/components/TuMeta";
import TuSelect from "@/src/components/TuSelect";
import { setApps as setBots } from "@/src/redux/reducers/user";
import { RootState } from "@/src/redux/store";
import { SITE, api, symbols } from "@/src/utils/constants";
import { IObj } from "@/src/utils/interfaces";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
    Avatar,
    Button,
    Checkbox,
    Input,
    Modal,
    Textarea,
} from "react-daisyui";
import { useDispatch, useSelector } from "react-redux";

const tetsBots = [
    {
        name: "Bot 1",
        desc: "Does what bot 1 does hommie. The hell!",
        ccy: "USDT",
        base: "BTC",
        id: "ssddaw",
    },
    {
        name: "Bot 2",
        desc: "Does what bot 2 does hommie. The hell!",
        ccy: "USDT",
        base: "ETH",
        id: "ssddaw",
    },
    {
        name: "Bot 3",
        desc: "Does what bot 3 does hommie. The hell!",
        ccy: "USDT",
        base: "SOL",
        id: "ssddaw",
    },
    {
        name: "Bot 4",
        desc: "Does what bot 4 does hommie. The hell!",
        ccy: "USDT",
        base: "XRP",
        id: "ssddaw",
    },
    {
        name: "Bot 5",
        desc: "Does what bot 5 does hommie. The hell!",
        ccy: "USDT",
        base: "DODGE",
        id: "ssddaw",
    },
    {
        name: "Bot 6",
        desc: "Does what bot 6 does hommie. The hell!",
        ccy: "USDT",
        base: "BTP",
        id: "ssddaw",
    },
];

export default function UserBotsPage() {
    const [strategies, setStrategies] = useState<any[]>([]);
    const [formData, setFormData] = useState<IObj>({bal: 5});
    const [err, setErr] = useState("")



    const router = useRouter();
    const dispatch = useDispatch();

    const newBotModalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        getBots()
    }, []);

    const userStore = useSelector((state: RootState) => state.user);

    const getBots = async() => { 
        const res = await api().get('/bots')
        dispatch(setBots(res.data))
     }
    const getStrategies = async () => {
        try {
            console.log("Getting strategies...");
            const res = await api().get("/strategies");
            setStrategies(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const createNewApp = async (e: any) => {
        e.preventDefault();
        const form = e.currentTarget;
        const btn = form.querySelector("button[type='submit']");
        const btnTxt = btn.innerText;

        const updateBtn = (txt = "Create bot", disabled = false) => {
            btn.disabled = disabled;
            btn.innerText = txt;
        };

        try {
            setErr("")
            const { name, amt, interval, strategy, pair, demo, active, desc } =
                form;
            const data = {
                name: name.value,
                amt: amt.value,
                interval: interval.value,
                strategy: strategy.value,
                pair: pair.value,
                demo: demo.checked,
                active: active.checked,
                desc: desc.value,
                user: userStore.user?.username,
            };

            updateBtn("...", true);
            const res = await api(true).post("/bots/create", data);
            console.log(res.data);
            dispatch(setBots(res.data.apps));
            updateBtn();
            newBotModalRef.current?.close()
        } catch (e: any) {
            console.log(e);
            updateBtn("Retry", false);
            const _err = typeof e.response?.data == "string" && e.response?.data?.startsWith("tuned:") ? e.response.data.replace("tuned:", "") : "Something went wrong"
            setErr(_err)
        }
    };
    return (
        <>
            <TuMeta title={`${router.query.username}'s bots - ${SITE}`} />
            <div className="p-5">
                <h1 className="text-xl text-gray-200">My bots</h1>
                <div className="mt-5">
                    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
                        {userStore.bots.map((e, i) => (
                            <BotCard bot={e} key={`item-${i * 1}`} />
                        ))}
                    </div>
                </div>
                <button
                    onClick={async (_) => {
                        await getStrategies();
                        newBotModalRef.current?.showModal();
                    }}
                    className="btn btn-md btn-primary btn-circle fab"
                >
                    <i className="fi fi-rr-plus"></i>
                </button>
                <Modal ref={newBotModalRef}>
                    <Modal.Header className="font-bold">New bot</Modal.Header>
                    <Modal.Body>
                        <form action="" onSubmit={createNewApp}>
                            <div className="grid sm:grid-cols-2 gap-3 items-end">
                                <div className="form-group">
                                    <label htmlFor="name" className="label">
                                        <span className="label-text">
                                            Bot name
                                        </span>
                                    </label>
                                    <Input
                                        placeholder="Enter bot name..."
                                        required
                                        id="name"
                                        name="name"
                                    />
                                </div>

                                <div className="form-group">
                                    <TuSelect
                                        placeholder="Pair"
                                        required
                                        name="pair"
                                        options={symbols.map((e) => ({
                                            label: e.join("/"),
                                            value: e,
                                        }))}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="label" htmlFor="amt">
                                    <span className="label-text">
                                        Starting amount
                                    </span>
                                </label>
                                <Input
                                    id="amt"
                                    required
                                    value={formData.bal}
                                    onChange={(e) => {
                                        const val: any = e.target.value;
                                        if (isNaN(val)) return;
                                        setFormData({
                                            ...formData,
                                            bal: e.target.value,
                                        });
                                    }}
                                    placeholder="Enter starting amount..."
                                />
                            </div>
                            <div className="mt-3 flex gap-3 items-center justify-center">
                                <div className="form-group flex items-center gap-2">
                                    <label htmlFor="demo" className="label">
                                        <span className="label-text">
                                            Demo?
                                        </span>
                                    </label>
                                    <Checkbox defaultChecked name="demo" id="demo" />
                                </div>

                                <div className="form-group flex items-center gap-2">
                                    <label htmlFor="active" className="label">
                                        <span className="label-text">
                                            Active?
                                        </span>
                                    </label>
                                    <Checkbox defaultChecked name="active" id="active" />
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3 items-end mt-3">
                                <div className="form-group">
                                    <TuSelect
                                        name="interval"
                                        required
                                        placeholder="Interval"
                                        options={[5, 15, 30, 60].map((e) => ({
                                            label: `${e}m`,
                                            value: e,
                                        }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <TuSelect
                                        required
                                        placeholder="Strategy"
                                        options={strategies.map((e, i) => ({
                                            label: e.name,
                                            value: i + 1,
                                        }))}
                                        name="strategy"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="desc" className="label">
                                    Description (optional)
                                </label>
                                <Textarea
                                    id="desc"
                                    name="desc"
                                    placeholder="Write short description for your bot..."
                                    maxLength={50}
                                />
                            </div>
                            {err?.length != 0 && <div className="mt-2 ml-2 text-whit fs-12 text-center text-warning"><p >{err?.replace("tuned:", "")}</p></div>}
                            <div className="form-group mt-2">
                                <Button
                                    type="submit"
                                    className="w-100p"
                                    color="primary"
                                >
                                    Create bot
                                </Button>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Actions>
                        <form method="dialog">
                            <Button>Close</Button>
                        </form>
                    </Modal.Actions>
                </Modal>
            </div>
        </>
    );
}
