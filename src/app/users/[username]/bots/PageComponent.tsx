"use client";
import BotCard from "@/src/components/BotCard";
import BotFormModal from "@/src/components/BotFormModal";
import TuMeta from "@/src/components/TuMeta";
import bots from "@/src/pgs/api/bots";
import { setBots } from "@/src/redux/reducers/user";
import { RootState } from "@/src/redux/store";
import { SITE } from "@/src/utils/constants";
import { IObj } from "@/src/utils/interfaces";
import Error from "next/error";
import { useParams } from "next/navigation";
import router from "next/router";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Page = ({ err, bots, ...props }) => {
    const [newBotModalRef, setBotModalRef] = useState<HTMLDialogElement>();

    const router = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        getBots();
    }, []);

    const userStore = useSelector((state: RootState) => state.user);

    const getBots = async () => {
        try {
            //const res = await api().get('/bots')
            dispatch(setBots(bots));
        } catch (e) {
            console.log(e);
        }
    };

    const showNewBotModal = async () => {
        newBotModalRef?.showModal();
    };

    const updateBots = (val: IObj) => {
        let bots = [...userStore.bots];
        const botIndex = bots.findIndex((el) => el._id == val._id);
        console.log(botIndex);
        bots[botIndex] = val;
        dispatch(setBots(bots));
    };
    return err ? (
        <Error statusCode={err.code} withDarkMode title={err.msg} />
    ) : (
        <>
            <TuMeta title={`${props.username}'s bots - ${SITE}`} />
            <div className="p-5">
                <h1 className="text-xl text-gray-200">My bots</h1>
                <div className="mt-5">
                    {userStore.bots.length ? (
                        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
                            {userStore.bots.slice(0).map((e, i) => (
                                <BotCard
                                    bot={e}
                                    key={`item-${i * 1}`}
                                    updateBot={updateBots}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="h-60vh w-100p  flex items-center justify-center">
                            <button
                                onClick={showNewBotModal}
                                className="btn text-xl btn-ghost border-card border-dotted border-1 br-10 p-5 w-60 h-40 flex itemx-center justify-center"
                            >
                                <span>
                                    <i className="fi fi-br-plus"></i>
                                </span>
                            </button>
                        </div>
                    )}
                </div>
                <button
                    onClick={showNewBotModal}
                    className="btn btn-md btn-primary btn-circle fab"
                >
                    <i className="fi fi-rr-plus"></i>
                </button>
                <BotFormModal
                    setRef={setBotModalRef}
                    onDone={(bot) =>
                        dispatch(setBots([...userStore.bots, bot]))
                    }
                />
            </div>
        </>
    );
};

export default Page;
