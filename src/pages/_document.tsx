import { createTeleporter } from "react-teleporter";
import TuMeta from "../components/TuMeta";
import {Head, Html, Main, NextScript} from 'next/document'

const HeadTeleport = createTeleporter()

const Doc = () => {
    return (
        <Html lang="en" className="dark" data-theme="tb">
            <Head/>
            <TuMeta/>
            <body>
                <Main/>
                <NextScript/>
            </body>
        </Html>
    );
};

export default Doc;
