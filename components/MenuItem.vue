<template>
    <li>
        <span>
        <nuxt-link v-if="to" :to="to" class="flex items-center gap-2 justify-start"><i v-if="icon" :class="icon"/> <slot/></nuxt-link>
        <span v-else class="flex items-center gap-2 justify-start"><i v-if="icon" :class="icon"/> <span><slot/></span></span>
     </span>
    </li>
     
</template>

<script setup lang="ts">

defineProps({
    to: {type: String},
    icon: {type: String},
})
</script>