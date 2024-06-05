import BotCard from "@/src/components/BotCard";
import BotFormModal from "@/src/components/BotFormModal";
import TuMeta from "@/src/components/TuMeta";
import TuSelect from "@/src/components/TuSelect";
import { CtxTeleport } from "@/src/layouts/Default";
import { setApps as setBots } from "@/src/redux/reducers/user";
import { RootState } from "@/src/redux/store";
import { SITE, api, symbols } from "@/src/utils/constants";
import { IObj } from "@/src/utils/interfaces";
import { GetServerSideProps } from "next";
import Error from "next/error";
import { useRouter } from "next/router";
import { FC, forwardRef, useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

interface IProps {
    bots?: IObj[];
    error?: IObj;
}

export const getServerSideProps = (async ({ query }: { query: IObj }) => {
    try {
        const res = await api().get("/bots", {
            params: { user: query.username },
        });

        return { props: { bots: res.data } };
    } catch (e: any) {
        console.log(e);
        const code = e.response?.status ?? 500;
        const _err =
            typeof e.response?.data == "string" &&
            e.response?.data?.startsWith("tuned:")
                ? e.response.data.replace("tuned:", "")
                : "Something went wrong";
        return { props: { error: { code, message: _err } } };
    }
}) satisfies GetServerSideProps<IProps>;

const UserBotsPage: FC<IProps> = ({ bots, error }) => {
    const [newBotModalRef, setBotModalRef] = useState<HTMLDialogElement>();

    const router = useRouter();
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
        let bots = [...userStore.bots]
        const botIndex = bots.findIndex(el=> el._id == val._id)
        console.log(botIndex);
        bots[botIndex] = val
        dispatch(setBots(bots));
    };
    return error ? (
        <Error statusCode={error.code} withDarkMode title={error.message} />
    ) : (
        <>
            <TuMeta title={`${router.query.username}'s bots - ${SITE}`} />
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

export default UserBotsPage;
