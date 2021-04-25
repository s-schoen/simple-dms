<template>
  <div class="bg-gray-300 p-5">
    <span class="">Welcome to the Vue 3 Template</span>
    <div class="mt-5">
      <Button label="This is a PrimeVue button" />
    </div>
    <div class="mt-5">
      <span>This is a FontAwesome Icon, styled with TailwindCss: </span>
      <i class="fas fa-user text-green-500" />
    </div>
  </div>
</template>

<script>
import Button from "primevue/button";

export default {
  components: { Button },
  setup() {
    return {};
  },
};
</script>

<style scoped></style>
