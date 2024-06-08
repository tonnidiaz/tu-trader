<template>
    <div
        :class='
          "loader bg-neutral "
        '
      >
      <div class="flex items-center justify-center h-full">
        <span class="loading loading-spinner text-primary w-100px"></span>

      </div>
        
      </div>
</template>

<script setup lang="ts">
defineProps({
    isAbsolute: {
        type: Boolean,
        default: false
    }
})
</script>
<style lang="scss">
.loader{
    left: 0;
    top: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
}
</style>
