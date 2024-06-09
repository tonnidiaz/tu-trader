<template>
    <ul ref="menu" style="white-space: nowrap;"
        class="dropdown-content dropdown-open menu divide-y divide-gray-100  p-1  fixed z-[10] bg-gray-700 shadow-md border-card border- br-6"
    >
        <slot />
    </ul>
</template>
<script setup lang="ts">

const menu = ref<HTMLUListElement>()
defineExpose({
    name: "Squash", menu
})
</script>

<style lang="scss">
    .menu {
        *{
            white-space: nowrap;
        }
    }
</style>


