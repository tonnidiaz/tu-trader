"use client"
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { api, pagesWithLayout } from "../utils/constants";
import { useEffect } from "react";
import { setUser } from "../redux/reducers/user";
import { createTeleporter } from "react-teleporter";
import { setReady, setStrategies } from "../redux/reducers/app";
import PageLoader from "next/dist/client/page-loader";
import { Loading } from "react-daisyui";
import { RootState } from "../redux/store";
import Loader from "../components/Loader";
export const CtxTeleport = createTeleporter();

const DefaultLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const dispatch = useDispatch();
    const appStore = useSelector((state: RootState) => state.app);

    useEffect(() => {
        init();
    }, []);

    const getUser = async () => {
        try {
            console.log("GETTING USER");
            const res = await api(true).post("/auth/login", {});
            dispatch(setUser(res.data.user));
        } catch (e) {
            console.log(e);
        }
    };

    const getStrategies = async () => {
        try {
            console.log("GETTING STRATEGIES...");
            const res = await api().get("/strategies");
            dispatch(setStrategies(res.data));
            console.log("GOT THE STRATEGIES");
        } catch (error) {
            console.log(error);
        }
    };

    const init = async () => {
        console.log(pagesWithLayout.indexOf(location.pathname ) == -1 );
        await getUser();
        await getStrategies();
        dispatch(setReady(true));
    };
    return !appStore.ready ? (
      <Loader/>
    ) : (
        <>
            { pagesWithLayout.indexOf(location.pathname ) == -1 && <Navbar></Navbar>}
            <div className={pagesWithLayout.indexOf(location.pathname ) == -1 ? "tu-app" : ""}>
            { pagesWithLayout.indexOf(location.pathname ) == -1 && <Sidebar></Sidebar>}
                <main>{children}</main>
            </div>
            <div id="ctx-overlay"></div>
        </>
    );
};

export default DefaultLayout;
