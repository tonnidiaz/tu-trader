<template>
    <div>
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
</script>