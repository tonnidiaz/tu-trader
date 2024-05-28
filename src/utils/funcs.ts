import $ from 'jquery';
export function openDrawer(){
    const drawer = $('.drawer')
    drawer.addClass('open')
}

export const sleep = async(ms: number)=>{
    await new Promise((res)=> setTimeout(res, ms))
}