<template>
    <!-- component -->
    <div class="">
        <div class="sm:flex sm:space-x-4">
            <div v-for="stat in stats"
                class="inline-block px-3 py-2 align-bottom bg-gray-900 rounded-lg text-center overflow-hidden shadow"
            >
                <h3 class="text-sm leading-6 font-medium text-gray-400">
                    {{ stat.title}}
                </h3>
                <p class="text-3xl font-bold text-gray-200">{{ stat.subtitle }}</p>
            </div>
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
