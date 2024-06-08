<template>
    <ul ref="menu" style="white-space: nowrap;"
        class="dropdown-content dropdown-open menu p-2 rounded-box fixed z-[10] bg-base-200 shadow-md border-card border-1 br-6"
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


