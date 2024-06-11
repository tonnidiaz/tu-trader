<template>
    <div>
        <div
            class="flex px-3 pt-2 pb-3.5 border-b border-gray-200 dark:border-gray-700"
        >
            <UInput v-model="q" placeholder="Filter orders..." />
        </div>
        <UTable :columns="tableCols" :rows="filteredRows">
            <template #side-data="{ row }">
                {{ row.side.value }}
            </template>
            <template #c-data="{ row }">
               <div >{{ row.fill }}</div>
               <div class="text-gray-100">{{ row.c }}</div>
            </template>
            <template #ts-data="{ row }">
                <div>{{ row.enterTs }}</div> 
                <div class="text-gray-100">{{ row.ts }}</div>
            </template>
            </UTable
        >
    </div>
</template>

<script setup lang="ts">
const q = ref("");
const tableCols: { key: any; label: string }[] = [
    { key: "ts", label: "Timestamp" },
    { key: "side", label: "Side" },
    { key: "c", label: "Close" },
    { key: "balance", label: "Balance" },
];

const props = defineProps({
    rows: { type: Array, default: [] },
});

const filteredRows = computed<any[]>(() => {
    if (!q.value) {
        return props.rows;
    }

    return props.rows.filter((row: any) => {
        return Object.values(row).some((value) => {
            return String(value).toLowerCase().includes(q.value.toLowerCase());
        });
    });
});
/* watch(props, val=>{
    console.log(val.rows);
    filteredRows.value = val.rows
}, {deep: true, immediate: true}) */
</script>
