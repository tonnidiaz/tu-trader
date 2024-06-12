export const useAppStore = defineStore("app", {
    state: ()=>({
        strategies: [] as IObj[],
        platforms: [] as string[],
        ready: false,
        path: '' as string
    }),

    actions: {
        setReady(val: typeof this.ready){this.ready = val},
        setStrategies(val: typeof this.strategies){this.strategies = val},
        setPlatforms(val: typeof this.platforms){this.platforms = val},
        setPath(val: typeof this.path){this.path = val},
    }
})