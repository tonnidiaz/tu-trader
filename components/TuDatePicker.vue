<template>
    <UPopover :popper="{ placement: 'top' }">
        <UButton
            @click="modalOpen = true"
            icon="i-heroicons-calendar-days-20-solid"
        >
            {{ format(new Date(date.start), "d MMM, yyy, hh:mm") }} -
            {{ format(new Date(date.end), "d MMM, yyy, hh:mm") }}
        </UButton>
        <template #panel="{ close }">
            <UCard class="">
                <template #header>
                    <h3>Select range</h3>
                </template>
                <div
                    class="rounded-m sm:flex-row flex flex-col items-center justify-center gap-3"
                >
                    <UInput type="datetime-local" v-model="date.start" />
                    <UInput type="datetime-local" v-model="date.end" />
                </div>
            </UCard>
        </template>
    </UPopover>
</template>
<script setup lang="ts">
import { format, isDate } from "date-fns";
const modalOpen = ref(false);
import type {
    DatePickerDate,
    DatePickerRangeObject,
} from "v-calendar/dist/types/src/use/datePicker.js";
import "v-calendar/dist/style.css";
import { isValidDate } from "~/utils/funcs";

const props = defineProps({
    modelValue: {
        type: Object,
        default: {
            start: new Date(Date.now() - 2 * 24 * 3600 * 1000)
                .toISOString()
                .slice(0, 16),
            end: new Date().toISOString().slice(0, 16),
        },
    },
});

const emit = defineEmits(["update:model-value", "close"]);
const date = computed({
    get: () => props.modelValue,
    set: (val) => {
        console.log(val);
        emit("update:model-value", val)},
});

</script>
