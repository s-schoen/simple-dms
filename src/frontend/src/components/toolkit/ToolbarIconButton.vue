<template>
  <i
    :class="[
      'fas',
      icon,
      { 'btn-icon': !disabled },
      { 'btn-icon-disabled': disabled },
    ]"
    @click="onEditDirectory"
  />
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {};
  },
};
</script>

<style scoped></style>
