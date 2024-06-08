import $ from "jquery";
import { ROOT, SITE, api } from "./constants";
import { IObj } from "./interfaces";
import { Metadata } from "next";

export const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
});

export function openDrawer() {
    const drawer = $(".drawer");
    drawer.addClass("open");
}

export const sleep = async (ms: number) => {
    await new Promise((res) => setTimeout(res, ms));
};
export const activateBot = async (el: any, bot: IObj, updateBot?: any) => {
    try {
        console.log(bot);
        el.innerHTML = `<span class="loading loading-dots loading-sm m-auto"></span>`;
        const val = !bot.active;
        const res = await api(true).post(`/bots/${bot._id}/edit`, {
            key: "active",
            val: val,
        });
        console.log(res.data);
        if (updateBot) updateBot(res.data);
        el.innerHTML = `<span>${
            res.data.active ? "Deactivate" : "Activate"
        }</span>`;
        return true;
    } catch (err) {
        console.log(err);
        el.innerHTML = `<span>${bot.active ? "Deactivate" : "Activate"}</span>`;
        return false;
    }
};
export const clearBotOrders = async (el: any, bot: IObj, updateBot?: any) => {
    try {
        console.log(bot);
        el.innerHTML = `<span class="loading loading-dots loading-sm m-auto"></span>`;
        const res = await api(true).post(`/bots/${bot._id}/clear-orders`);

        if (updateBot) updateBot(res.data);
        el.innerHTML = `<span>Clear orders}</span>`;
        return true;
    } catch (err) {
        console.log(err);
        el.innerHTML = `<span>Clear orders</span>`;
        return false;
    }
};

export const toSelectStrategies = (strategies: IObj[]) =>
    strategies.map((e, i) => ({
        label: e.name,
        value: i + 1,
    }));

interface IMetaProps {
    title?: string;
    src?: string;
    desc?: string;
    url?: string;
    keywords?: string;
}
export const genMeta = ({
    title = `${SITE} - A trading bot from Tunedbass`,
    src = `${ROOT}/assets/images/home.png`,
    desc,
    url = ROOT,
    keywords,
}: IMetaProps) => {
    const _keywords = `${SITE}, ${SITE} a tunedbass site, trading bot, tradingbot, tradingbot from Tunedbass, crypt`;
    const _description = `${SITE} is an automated trading bot from TunedBass`;
    const _title = `${SITE} - A trading bot from Tunedbass`
    const meta: Metadata = {
        title: title?? _title,
        description: `${desc}\n${_description}`, keywords: `${_keywords},${keywords}`,
        openGraph: {
            type: "website", url, title: title ?? _title,description: `${desc}\n${_description}`
        },
        twitter: {images: src},
        authors: {name: "Tonni Diaz"}
    };
    return meta
};
