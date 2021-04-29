<template>
  <button :class="classes" :disabled="disabled">
    <i v-if="loading" class="fas fa-spinner text-l mr-2 animate-spin" />
    <slot></slot>
  </button>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    variant: {
      type: String,
      default: "default",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const classes = ref(["h-10", "rounded-md", "disabled:opacity-50"]);

    let colorVariant;
    switch (props.variant) {
      case "gray":
        colorVariant = [
          "bg-gray-500",
          "hover:bg-gray-600",
          "text-white",
          "disabled:bg-gray-500",
        ];
        break;
      default:
        colorVariant = [
          "bg-blue-400",
          "hover:bg-blue-500",
          "disabled:bg-blue-400",
        ];
    }

    classes.value = [...classes.value, ...colorVariant];

    return { classes };
  },
};
</script>

<style scoped></style>
