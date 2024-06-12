import axios from "axios";

export const useTuFetch : typeof useFetch= (...args)=> useFetch(args[0], {...args[1], headers: {...args[1]?.headers, Authorization:  `Bearer ${localStorage.getItem(STORAGE_KEYS.authTkn)}`}})
export const api = (auth = false) => axios.create({ baseURL: BEND_URL, headers: {
    Authorization: auth ? `Bearer ${localStorage.getItem(STORAGE_KEYS.authTkn)}` : null, "Content-Type": "application/json"
},  });
export const localApi = (auth = false) => axios.create({ baseURL: '/api', headers: {
    Authorization: auth ? `Bearer ${localStorage.getItem(STORAGE_KEYS.authTkn)}` : null, "Content-Type": "application/json"
},  });