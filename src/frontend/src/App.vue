<template>
  <div class="bg-gray-200 h-screen w-screen flex flex-col">
    <TheHeader />
    <router-view class="flex-auto h-full" />
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from "@/components/TheHeader";
import TheFooter from "@/components/TheFooter";

export default {
  components: { TheHeader, TheFooter },
  setup() {
    return {};
  },
};
</script>

<style scoped></style>
