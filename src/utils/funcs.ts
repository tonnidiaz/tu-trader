import $ from 'jquery';
import { api } from './constants';
import { IObj } from './interfaces';
export function openDrawer(){
    const drawer = $('.drawer')
    drawer.addClass('open')
}

export const sleep = async(ms: number)=>{
    await new Promise((res)=> setTimeout(res, ms))
}
export const activateBot = async (el: any, bot: IObj, updateBot? : any) => {
    
    try {
        
        el.innerHTML = `<span class="loading loading-dots loading-sm m-auto"></span>`
        const val = !bot.active;
        const res = await api(true).post(`/bots/${bot.id}/edit`, {
            key: "active",
            val: val,
        });
        if (updateBot)
            updateBot(res.data);
        return true;
    } catch (err) {
        console.log(err);
        el.innerHTML = `<span>${bot.active ? "Deactivate" : "Activate"}</span>`
        return false;
    }
};