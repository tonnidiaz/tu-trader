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
    const { setReady, setStrategies}= appStore
    const {setUser} = useUserStore()
    const {ready} = storeToRefs(useAppStore())

    onMounted(() => {
        init();
    });

    const getUser = async () => {
        try {
            console.log("GETTING USER");
            const res = await api(true).post("/auth/login", {});
            setUser(res.data.user);
        } catch (e) {
            console.log(e);
        }
    };

    const getStrategies = async () => {
        try {
            console.log("GETTING STRATEGIES...");
            const res = await api().get("/strategies");
            setStrategies(res.data);
            console.log("GOT THE STRATEGIES");
        } catch (error) {
            console.log(error);
        }
    };

    const init = async () => {
        console.log(pagesWithLayout.indexOf(location.pathname ) == -1 );
        await getUser();
        await getStrategies();
        setReady(true)
    };
</script>