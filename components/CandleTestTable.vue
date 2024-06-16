<template>
    <div>
        <div
            class="flex px-3 pt-2 pb-3.5 border-b border-gray-200 dark:border-gray-700"
        >
            <UInput v-model="q" placeholder="Filter orders..." />
        </div>
        <UTable class="backtest-table" :columns="tableCols" :rows="filteredRows">
            <template #side-data="{ row }">
                {{ row.side.value }}
            </template>
            <template #std-data="{ row }">
               <div  class="fw-6 wp-wrap">
                <p v-for="k in Object.keys(row.std)">{{ `${k}: ${row.std[k]}` }}</p>
               </div>
            </template>
            <template #ha-data="{ row }">
               <div  class="fw-6 wp-wrap">
                <p v-for="k in Object.keys(row.ha)">{{ `${k}: ${row.ha[k]}` }}</p>
               </div>
            </template>
          
            </UTable
        >
    </div>
</template>

<script setup lang="ts">
const q = ref("");
const tableCols: { key: any; label: string }[] = [
    { key: "ts", label: "Timestamp" },
    { key: "std", label: "Standard" },
    { key: "ha", label: "Heikin-ashi" },
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

