<template>
    <div class="p-4">
        <h1>Hello</h1>
<div class="w-40 bg-gray-500 p-4">
     <VDatePicker mode="dateTime" is24hr color="green" isDark v-model.range="range" is-range>
    <template #default="{ inputValue, inputEvents }">
      <div class="flex flex-col justify-center items-center gap-2">
        <UInput :value="inputValue.start" v-on="inputEvents.start" />
        <UInput :value="inputValue.end" v-on="inputEvents.end" />
      </div>
    </template>
  </VDatePicker>
</div>
       

  <UPopover :popper="{ placement: 'bottom-start' }">
        <UButton icon="i-heroicons-calendar-days-20-solid">
            {{ format(range.start, "d MMM, yyy, hh:mm") }} -
            {{ format(range.end, "d MMM, yyy, hh:mm") }}
        </UButton>

        <template #panel="{ close }">
            <div
                class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800 bg-gray-800 p-2"
            >
                <DatePicker v-model="range" @close="close" />
            </div>
        </template>
    </UPopover>
       
    </div>
</template>
<script setup lang="ts">
import 'v-calendar/style.css';

import { useAppStore } from '~/src/stores/app';
import { DatePicker as VDatePicker, } from "v-calendar";
import { format } from 'date-fns';
const { strategies } = storeToRefs(useAppStore())
const range = ref({
        start: new Date("2023-01-01 00:00:00"),
        end: new Date("2023-10-28 23:59:00"),
    })
const items = [
    [{
        label: "Item 1"
    }]
]

onMounted(()=>{
    console.log(strategies);
})
</script>