import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import "@/src/styles/globals.css";
import "@/src/styles/styles.scss";
import "@/src/styles/styles2.scss";
import Head from "next/head";
import { Theme } from "react-daisyui";
import { SITE } from "../utils/constants";
import DefaultLayout from "../layouts/Default";
import TuMeta from "../components/TuMeta";
import { Provider } from "react-redux";
import { store } from "../redux/store";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout ?? ((page) => page);
    return (
        <Provider store={store}>
            {getLayout(
                Component.getLayout ? (
                    <div>
                        <Component {...pageProps} />
                    </div>
                ) : (
                    <DefaultLayout>
                        <Component {...pageProps} />
                    </DefaultLayout>
                )
            )}
        </Provider>
    );
}
