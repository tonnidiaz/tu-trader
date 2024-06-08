export const useUserStore = defineStore("user", {
    state: ()=> ({
        user: null as  IObj | null,
        bots: [] as IObj[],
    }),
    actions: {
        setUser(val : any){
            this.user = val
        }
        setBots(val : any){
            this.bots = val
        }
    }
})