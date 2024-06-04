import $ from "jquery";
import { api } from "./constants";
import { IObj } from "./interfaces";

 export const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })

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
        el.innerHTML = `<span>${res.data.active ? "Deactivate" : "Activate"}</span>`;
        return true;
    } catch (err) {
        console.log(err);
        el.innerHTML = `<span>${bot.active ? "Deactivate" : "Activate"}</span>`;
        return false;
    }
};

export const toSelectStrategies = (strategies: IObj[]) =>
    strategies.map((e, i) => ({
        label: e.name,
        value: i + 1,
    }));
