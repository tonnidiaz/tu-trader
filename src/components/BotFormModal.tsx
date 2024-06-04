import {
    Modal,
    Checkbox,
    Textarea,
    Button,
    Input,
    ModalProps,
} from "react-daisyui";
import { api, selectIntervals, selectSymbols, symbols } from "../utils/constants";
import TuSelect from "./TuSelect";
import { FC, RefObject, useEffect, useRef, useState } from "react";
import { IObj } from "../utils/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { toSelectStrategies } from "../utils/funcs";

interface IProps extends ModalProps {
    fd?: IObj;
    onDone: (bot: IObj) => void;
    setRef: (ref: HTMLDialogElement) => void;
    mode?: "Create" | "Edit";
}

const BotFormModal: FC<IProps> = ({
    onDone,
    setRef,
    mode = "Create",
    ...props
}) => {
    const [err, setErr] = useState("");
    const [fd, setFD] = useState<IObj>(props.fd ?? {demo: true, active: false});

    const userStore = useSelector((state: RootState) => state.user);
    const appStore = useSelector((state: RootState) => state.app);

    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (ref.current) setRef(ref.current);
    }, [ref.current]);



    const createNewApp = async (e: any) => {
        e.preventDefault();
        const form = e.currentTarget;
        const btn = form.querySelector("button[type='submit']");

        const updateBtn = (txt = mode + " bot", disabled = false) => {
            btn.disabled = disabled;
            btn.innerText = txt;
        };

        try {
            
            setErr("");
            let data : IObj= { ...fd, start_amt: Number(fd.start_amt ?? 0),interval: Number(fd.interval.value), pair: fd.pair.value, strategy: Number(fd.strategy.value), };

            data = mode == "Create" ? {...data,  user: userStore.user?.username} : {key: "multi", val: data} 
            console.log(data);
            updateBtn("...", true);
            const url = mode == "Create" ? "/bots/create" : `/bots/${fd.id}/edit`
            
            const res = await api(true).post(url, data);
            console.log(res.data);
            //dispatch(setBots(res.data.bots));
            onDone(res.data);
            updateBtn();
            ref.current?.close();
        } catch (e: any) {
            console.log(e);
            updateBtn("Retry", false);
            const _err =
                typeof e.response?.data == "string" &&
                e.response?.data?.startsWith("tuned:")
                    ? e.response.data.replace("tuned:", "")
                    : "Something went wrong";
            setErr(_err);
        }
    };

    return (
        <Modal ref={ref} backdrop {...props}>
            <Modal.Header className="font-bold">{mode} bot</Modal.Header>
            <Modal.Body>
                <form action="" onSubmit={createNewApp}>
                    <div className="grid sm:grid-cols-2 gap-3 items-end">
                        <div className="form-group">
                            <label htmlFor="name" className="label">
                                <span className="label-text">Bot name</span>
                            </label>
                            <Input
                                placeholder="Enter bot name..."
                                required
                                id="name"
                                name="name"
                                value={fd.name}
                                onChange={(e) =>
                                    setFD({ ...fd, name: e.target.value })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <TuSelect
                                placeholder="Pair"
                                required
                                name="pair"
                                id="pair"
                                options={selectSymbols}
                                value={fd.pair}
                                onChange={(e) =>
                                    setFD({ ...fd, pair: e })
                                }
                            />
                        </div>
                    </div>
                   {mode == "Create" &&   <div className="form-group">
                        <label className="label" htmlFor="start_amt">
                            <span className="label-text">Start amount</span>
                        </label>
                      <Input
                            id="start_amt"
                            required
                            value={fd.start_amt}
                            onChange={(e) => {
                                const val: any = e.target.value;
                                if (isNaN(val)) return;
                                setFD({
                                    ...fd,
                                    start_amt: e.target.value,
                                });
                            }}
                            placeholder="Enter start amount..."
                        />
                    </div>}
                    <div className="mt-3 flex gap-3 items-center justify-center">
                        <div className="form-group flex items-center gap-2">
                            <label htmlFor="demo" className="label">
                                <span className="label-text">Demo?</span>
                            </label>
                            <Checkbox
                                name="demo"
                                id="demo"
                                checked={fd.demo}
                                onChange={(e) =>
                                    setFD({ ...fd, demo: e.target.checked })
                                }
                            />
                        </div>

                        { mode == "Create" && <div className="form-group flex items-center gap-2">
                            <label htmlFor="active" className="label">
                                <span className="label-text">Active?</span>
                            </label>
                            <Checkbox
                                checked={fd.active}
                                onChange={(e) =>
                                    setFD({ ...fd, active: e.target.checked })
                                }
                                name="active"
                                id="active"
                            />
                        </div>}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 items-end mt-3">
                        <div className="form-group">
                            <TuSelect
                                name="interval"
                                id="interval"
                                required
                                placeholder="Interval"
                                options={selectIntervals}
                                value={fd.interval}
                                onChange={(e) =>
                                    {
                                        console.log(e.value);
                                        setFD({ ...fd, interval: e })}
                                }
                            />
                        </div>
                        <div className="form-group">
                            <TuSelect
                                required
                                placeholder="Strategy"
                                options={toSelectStrategies(appStore.strategies)}
                                name="strategy"
                                id="strategy"
                                value={fd.strategy}
                                onChange={(e) =>
                                    {
                                        setFD({ ...fd, strategy: e })}
                                }
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
                            value={fd.desc}
                            onChange={e=>{setFD({...fd, desc: e.target.value})}}
                        />
                    </div>
                    {err?.length != 0 && (
                        <div className="mt-2 ml-2 text-whit fs-12 text-center text-warning">
                            <p>{err?.replace("tuned:", "")}</p>
                        </div>
                    )}
                    <div className="form-group mt-2">
                        <Button
                            type="submit"
                            className="w-100p"
                            color="primary"
                        >
                            {mode} bot
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default BotFormModal;
