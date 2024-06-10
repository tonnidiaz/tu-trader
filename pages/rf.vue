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
  <USelectMenu
    searchable
    searchable-placeholder="Search a person..."
    class="w-full lg:w-48"
    placeholder="Select a person"
    :options="strategies"
    option-attribute="name"
    :model-value="strategies[6]"
  />


       
    </div>
</template>
<script setup lang="ts">
import { useAppStore } from '~/src/stores/app';

const { strategies } = storeToRefs(useAppStore())
const items = [
    [{
        label: "Item 1"
    }]
]

onMounted(()=>{
    console.log(strategies);
})
</script>