import Head from "next/head";
import React from "react";
import { ROOT, SITE } from "../utils/constants";

interface IProps {
    title?: string
    src?: string
    desc?: string
    url?: string
    keywords?: string
}

const TuMeta: React.FC<IProps> = ({
    title = `${SITE} - A trading bot from Tunedbass`,
    src = `${ROOT}/assets/images/home.png`,
    desc,
    url = ROOT,
    keywords,
}) => {
    const _keywords = `${SITE}, ${SITE} a tunedbass site, trading bot, tradingbot, tradingbot from Tunedbass, crypt`;
    const _description = `${SITE} is an automated trading bot from TunedBass`;

    return (
        <>
            <title>{title}</title>
            <meta name="description" content={`${desc}\n${_description}`} />
            <meta name="keywords" content={`${_keywords},${keywords}`} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content="title ?? _title" />
            <meta
                property="og:description"
                content={`${desc}\n${_description}`}
            />
            <meta property="og:image" content={src} />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta
                property="twitter:description"
                content={`${desc}\n${_description}`}
            />
            <meta property="twitter:image" content="src" />

            <meta name="author" content="Tonni DIaz" />
            <meta name="publisher" content="Tonni DIaz" />
            <meta name="copyright" content="Tunedbass" />
        </>
    );
};

export default TuMeta;
