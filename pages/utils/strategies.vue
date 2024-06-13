<template>
    <div>
        <TMeta :title="`Strategies - ${SITE}`"/>
        <div>
            <fieldset class="fieldset w-full sm:w-96 m-auto border-card border-1 p-2 md:p-4">
            <legend>
                <h1 class="text-gray-200">Strategies</h1>
            </legend>
            <div class="flex flex-col gap-1">
                <UAccordion  :items="strategies.map(str=> ({label: str.name, content: str.desc})) ">
                    <template #item="{item}">
                        <div class="px-3">{{ item.content }}</div>
                    </template>
                </UAccordion>
            </div>
            </fieldset>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useAppStore } from '~/src/stores/app';

const {strategies} = storeToRefs(useAppStore())
</script>