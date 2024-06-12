<template>
    <!-- component -->
        <div class="flex overflow-x-scroll">
            <div v-for="stat in stats"
                class="inline-block px-3 py-2 align-bottom bg-gray-900 rounded-lg text-center overflow-hidden shadow-sm"
            >
                <h3 class="text-sm leading-6 font-medium text-gray-400">
                    {{ stat.title}}
                </h3>
                <p class="stat-value text-lg font-bold ">{{ stat.subtitle }}</p>
            </div>
        </div>
</template>

<script setup lang="ts">

interface IStat {title: string, subtitle: any, click?: ()=> any}
const testStats : IStat[] = [
    {title: "Trades", subtitle: 445},
    {title: "Profit", subtitle: `USDT ${formatter.format(127439943254).replace('$', '')}`},
    {title: "W", subtitle: '56%'},
    {title: "L", subtitle: '44%'},
]

    defineProps({
        stats: {type: Array<IStat>, default:  [
    {title: "Trades", subtitle: 445},
    {title: "Profit", subtitle: `USDT ${formatter.format(127439943254).replace('$', '')}`},
    {title: "W", subtitle: '56%'},
    {title: "L", subtitle: '44%'},
]}
    })
</script>
<style lang="scss"
>
.stat-value {
    font-size: 2.25rem;
    line-height: 2.5rem;
    font-weight: 800;
}
</style>