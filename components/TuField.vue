<template>
<!--     <label>
        <div class="label">
            <span class="label-text">{{ label }}</span>
        </div> -->
        <input
            :type="type"
            :required="required"
            class="input input-bordered w-full"
            :value="val"
            @input="(e: any)=>$emit('update:val', `Val: ${e.target.value} `)"
            :placeholder="hint"
        />
<!--     </label>
 --></template>

<script setup lang="ts">
defineProps({
    val: Object,
    required: Boolean,
    type: String,
    hint: String,
    label: String,
});

defineEmits([
    "update:val"
])
</script>
