<template>
    <Loader v-if="!ready"/>
    <div v-else>
        <Navbar />
        <div class="tu-app">
            <Sidebar />
            <main style="padding: 0 10px"><slot /></main>
        </div>
    </div>
    </template>
    <script setup lang="ts">
    import Navbar from "~/components/Navbar.vue";
    import Sidebar from "~/components/Sidebar.vue";
import { useAppStore } from "~/src/stores/app";
import { useUserStore } from "~/src/stores/user";

    const appStore = useAppStore()
    const { setReady, setStrategies, setPlatforms}= appStore
    const {setUser} = useUserStore()
    const {ready} = storeToRefs(useAppStore())

    onMounted(() => {
        socket.on('strategies', ({data, err})=>{
            if (err) {console.log(err); return}
            setStrategies(data)
            console.log("GOT THE STRATEGIES");
        })
        socket.on('platforms', 
            ({data, err})=>{
            if (err) {console.log(err); return}
            setPlatforms(data)
            console.log("GOT THE PLATFORMS");
        
        })
        init();
    });

    const getUser = async () => {
        try {
            console.log("GETTING USER");
            const res = await localApi(true).post("/auth/login", {});
            setUser(res.data.user);
        } catch (e) {
            console.log(e);
        }
    };

    const getStrategies = async () => {
        try {
            console.log("GETTING STRATEGIES...");
            socket.emit('strategies')
        } catch (error) {
            console.log(error);
        }
    };

    const init = async () => {
        console.log(pagesWithLayout.indexOf(location.pathname ) == -1 );
        await getUser();
        console.log('GETTING PLATFORMS...');
        socket.emit('platforms')
        await getStrategies();
        setReady(true)
    };
</script>