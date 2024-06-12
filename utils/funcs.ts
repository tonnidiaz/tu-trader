import $ from "jquery";

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
        await sleep(1500)
        const val = !bot.active;
        const res = await localApi(true).post(`/bots/${bot._id}/edit`, {
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
        const res = await localApi(true).post(`/bots/${bot._id}/clear-orders`);

        if (updateBot) updateBot(res.data);
        el.innerHTML = `<span>Clear orders</span>`;
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

const toISOString = (date: string)=>{
    let dateArr = date.split(',')
    const time = dateArr[1]
    dateArr = dateArr[0].split('/')
    date = `${dateArr[2]}-${dateArr[0]}-${dateArr[1]}`
    return `${date}${time} GMT+2`

}

export const parseDate = (date: string)=> toISOString(new Date(date).toLocaleString('en-US', {timeZone: 'Africa/Johannesburg'}))
export const isValidDate = function(date: string) {
    return (new Date(date) .toString()!== "Invalid Date") && !isNaN(Date.parse(date));
}