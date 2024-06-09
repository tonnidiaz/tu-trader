<template>
    <div class="p-4">
        <h1>Hello</h1>
        <tu-select :options="['One', 'Two', 'Three']"></tu-select>
        <UIcon name="i-heroicons-light-bulb" />
        <div class="flex items-center justify-between">
            <u-dropdown class="dark" :items="items" background="bg-gray-800" dark>
            <u-button :ui="{rounded: 'rounded-full'}"><i class="fi fi-rr-circle-ellipsis"></i></u-button>
        </u-dropdown> <u-dropdown :items="items">
            <u-button :ui="{rounded: 'rounded-full'}"><i class="fi fi-rr-circle-ellipsis"></i></u-button>
        </u-dropdown>
        </div>
       
    </div>
</template>
<script setup lang="ts">
const items = [
    [{
        label: "Item 1"
    }]
]
</script>