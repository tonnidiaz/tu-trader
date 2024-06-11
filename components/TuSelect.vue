<template>
    <USelectMenu
    :searchable-placeholder="innerHint"
    option-attribute="label" value-attribute="value"
    :options="options"
  />
</template>

<script setup lang="ts">
import type { ISelectItem } from '~/utils/interfaces';

    defineProps<{innerHint?: string, options?: ISelectItem[]}>()
</script> 