"use client";
import TuField from "@/src/components/TuField";
import TuForm from "@/src/components/TuForm";
import { API, SITE, socket, symbols } from "@/src/utils/constants";
import { IObj } from "@/src/utils/interfaces";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import $ from 'jquery'

const initRes = { data: {} };

const Backtest = () => {
    const [res, setRes] = useState<IObj>(initRes);
    const [formData, setFormData] = useState<IObj>({});
    const [msg, setMsg] = useState<IObj>({});
    const [strategies, setStrategies] = useState<any[]>([])
    const paramsAreaRef = useRef<any>()

    useEffect(() => {
        getStrategies()
        socket.on("backtest", onBacktest);
        socket.on("disconnect", (r, d) => {
            console.log("IO DISCONNECTED");
            console.log(r);
            console.log(d);
        });
    }, []);

    const getStrategies = async () => { 
        const res = await API.get('/strategies')
        setStrategies(res.data);
     }

    const onBacktest = (data: any) => {
        console.log("ON BACKTEST");
        if (data.data) {
            setRes(data.data);

            setMsg({});
        } else if (data.err) {
            setMsg({ msg: data.err, err: true });
        } else {
            console.log(data);
            setMsg({ msg: data });
        }
    };
    const handleSubmit = async (e: any) => {
        try {
            const data = formData;
            const start = data.start
                ? data.start.split("T").join(" ") + ":00"
                : null;
            const end = data.end ? data.end.split("T").join(" ") + ":00" : null;
            const fd = { ...data, start, end, username: "tonnidiaz" };
            console.log(fd);
            setRes(initRes);
            socket.emit("backtest", fd);
        } catch (e) {
            console.log(e);
        }
    };

    const onCtrlBtnClick = (e: any) => { 
        const paramsArea = paramsAreaRef.current
        $(paramsArea!).toggleClass('open')
     }
    return (
        <>
            <Head>
                <title>Backtest</title>
            </Head>
            <div className=" w-100p h-100p relative md:p-5 p-2 flex flex-col">
                <div className="md:p-4 p-2 my-2 border-md border-card border-1 br-10 flex-1 overflow-y-scroll max-h-80vh">
                    <h2 className="font-bold fs-20">RESULTS</h2>
                    <div className="my-2 flex gap-10">
                        <div>
                            <p>
                                Total trades:{" "}
                                <span className="text-whit font-bold">
                                    {res.trades ?? 0}
                                </span>
                            </p>
                            <p>
                                Profit:{" "}
                                <span className="text-whit font-bold">
                                    ${res.profit ?? 0}
                                </span>
                            </p>
                        </div>
                        <div>
                            <p>
                                P:{" "}
                                <span className="text-whit font-bold">
                                    {res.gain ?? 0}%
                                </span>
                            </p>
                            <p>
                                L:{" "}
                                <span className="text-whit font-bold">
                                    {res.loss ?? 0}%
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 overflow-y-scroll">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Timestamp
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Side
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Close
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Balance
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(res.data).map(
                                    (ts: any, i: any) => {
                                        const data = res.data[ts];
                                        return (
                                            <tr
                                                key={`row-${i + 1}`}
                                                className="odd:bg-gray-900 even:bg-gray-800 border-gray-700"
                                            >
                                                <th
                                                    scope="row"
                                                    className="px-6 py-4 font-medium text-gray-200 whitespace-nowrap dark:text-white"
                                                >
                                                    {ts}
                                                </th>
                                                <td
                                                    className={
                                                        "px-6 py-4 " +
                                                        (data[
                                                            "side"
                                                        ].toLowerCase() == "buy"
                                                            ? "text-success"
                                                            : "text-error")
                                                    }
                                                >
                                                    {data["side"].toUpperCase()}
                                                </td>
                                                <td className="px-6 py-4 text-gray-300">
                                                    ${data["close"]}
                                                </td>
                                                <td className="px-6 py-4 text-gray-300">
                                                    {data["side"] == "buy"
                                                        ? res.base
                                                        : "$"}{" "}
                                                    {data["balance"]}
                                                    &nbsp;&nbsp;{data["profit"]}
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div ref={paramsAreaRef} className="p-4 border-1 border-card br-10 params-area bg-base-100 shadow-lg">
                    <div className="flex justify-end w-100p mb-2">
                        <button onClick={onCtrlBtnClick} className="ctrl-btn btn btn-primary mb-2">
                            <i className="fi fi-rr-angle-down"></i>
                        </button>
                    </div>
                    <div className="content"><TuForm onSubmit={handleSubmit}>
                        <div className="flex flex-col items-center">
                            <div className="form-field flex items-center flex-col md:flex-row justify-center gap-4">
                               <div className="flex items-center gap-4">
                                <select
                                    name="strategy"
                                    id="str"
                                    className="select select-bordered"
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            strategy: e.target.value,
                                        });
                                    }}
                                    defaultValue={'4'}
                                >
                                    <option value="" disabled>
                                        Strategy
                                    </option>
                                    {strategies.map((e, i) => (
                                        <option
                                            value={i + 1}
                                            key={`str_${i + 1}`}
                                            title={e.desc}
                                        >
                                            {e.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="select select-bordered"
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            interval: e.target.value,
                                        });
                                    }}
                                    defaultValue={15}
                                >
                                    <option value="" disabled>
                                        Interval
                                    </option>
                                    {[5, 15, 30, 60].map((e, i) => (
                                        <option value={e} key={`str_${i + 1}`}>
                                            {e}m
                                        </option>
                                    ))}
                                </select>
                               </div>
                                
                                <div
                                    className="flex items-center gap-2"
                                    title="Use previously downloaded data if available"
                                >
                                    <label htmlFor="offline">Offline:</label>
                                    <input
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                offline: e.target.checked,
                                            })
                                        }
                                        className="checkbox"
                                        type="checkbox"
                                        name="offline"
                                        id="offline"
                                    />
                                </div>
                            </div>
                            <div className="form-field m-auto text-center flex items-center md:items-end flex-col md:flex-row justify-center gap-4">
                                <label>
                                    <div className="label">
                                        <span className="label-text">
                                            Initial balance:{" "}
                                        </span>
                                    </div>
                                    <input
                                        type="number"
                                        className="input input-bordered w-full sm:w-auto"
                                        defaultValue={formData.bal}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                bal: e.target.value,
                                            });
                                        }}
                                    />
                                </label>
                                <select
                                    className="select select-bordered"
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            lev: e.target.value,
                                        });
                                    }}
                                    defaultValue={""}
                                >
                                    <option value="" disabled>
                                        Margin
                                    </option>
                                    {[1, 2, 3, 4, 5].map(
                                        (e: any, i: number) => (
                                            <option key={e} value={e}>
                                                x{e}
                                            </option>
                                        )
                                    )}
                                </select>
                                <select
                                    className="select select-bordered"
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            symbol: e.target.value,
                                        });
                                    }}
                                    defaultValue={""}
                                >
                                    <option value="" disabled>
                                        Pair
                                    </option>
                                    {symbols.map((e: any, i: number) => (
                                        <option key={e} value={e}>
                                            {e.join("/")}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-2 flex flex-col md:flex-row justify-center gap-5">
                                <label>
                                    <div className="label">
                                        <span className="label-text">
                                            From:{" "}
                                        </span>
                                    </div>
                                    <TuField
                                        type="datetime-local"
                                        defaultValue={formData.start}
                                        onChange={(e) => {
                                            console.log(e.target.value);
                                            setFormData({
                                                ...formData,
                                                start: e.target.value,
                                            });
                                        }}
                                        hint={""}
                                    />
                                </label>
                                <label>
                                    <div className="label">
                                        <span className="label-text">To: </span>
                                    </div>
                                    <TuField
                                        type="datetime-local"
                                        defaultValue={formData.end}
                                        disabled={!formData.start}
                                        min={
                                            formData.start
                                                ? formData.start
                                                : null
                                        }
                                        max={
                                            formData.start
                                                ? formData.start.split("-")[0] +
                                                  "-12-31T23:59"
                                                : undefined
                                        }
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                end: e.target.value,
                                            });
                                        }}
                                        required={false}
                                        hint={""}
                                    />
                                </label>
                            </div>
                            <div className="form-field m-auto text-center mt-5 w-full relative">
                                {msg.msg && (
                                    <div className="my-2 p-2 bg-base-300 border-card border-1 br-5">
                                        <span>{msg.msg}</span>
                                    </div>
                                )}
                                <button
                                    disabled={
                                        !(
                                            formData.bal > 0 &&
                                            formData.symbol != null
                                        ) ||
                                        (Object.keys(msg).length > 0 &&
                                            !msg.err)
                                    }
                                    className="btn btn-primary w-full"
                                    type="submit"
                                >
                                    START
                                </button>
                            </div>
                        </div>
                    </TuForm></div>
                    
                </div>
            </div>
        </>
    );
};

export default Backtest;
