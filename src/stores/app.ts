export const useAppStore = defineStore("app", {
    state: ()=>({
        strategies: [] as IObj[],
        ready: false
    }),

    actions: {
        setReady(val: typeof this.ready){this.ready = val},
        setStrategies(val: typeof this.strategies){this.strategies = val},
    }
})