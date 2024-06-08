import { createTeleporter } from "react-teleporter";
import TuMeta from "../components/TuMeta";
import {Head, Html, Main, NextScript} from 'next/document'


const Doc = () => {
    return (
        <Html lang="en" className="dark" data-theme="dark">
            <Head/>
            <TuMeta/>
            <body>
                <Main/>
                <div id="click-me"></div>
                <NextScript/>
            </body>
        </Html>
    );
};

export default Doc;
