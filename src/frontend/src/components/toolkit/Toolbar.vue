<template>
  <div class="h-12 bg-gray-200 flex items-center justify-between p-4 w-full">
    <div class="space-x-3">
      <slot name="left"></slot>
    </div>
    <div class="space-x-3">
      <slot name="center"></slot>
    </div>
    <div class="space-x-3">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>

<style scoped></style>
