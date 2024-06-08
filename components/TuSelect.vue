<template>
    <USelectMenu
    searchable
    searchable-placeholder="Search a person..."
    class="w-full lg:w-48"
    placeholder="Select a person"
    :options="['Wade Cooper', 'Arlene Mccoy', 'Devon Webb', 'Tom Cook', 'Tanya Fox', 'Hellen Schmidt', 'Caroline Schultz', 'Mason Heaney', 'Claudie Smitham', 'Emil Schaefer']"
    model-value="Tanya Fox"
  />
</template>

<script setup lang="ts">

    const options = ["One", "Two", "Three"]
</script> 