<template>
  <button :class="classes">
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
  },
  setup(props) {
    const classes = ref(["h-10", "rounded-md"]);

    let colorVariant;
    switch (props.variant) {
      case "gray":
        colorVariant = ["bg-gray-500", "hover:bg-gray-600", "text-white"];
        break;
      default:
        colorVariant = ["bg-blue-400", "hover:bg-blue-500"];
    }

    classes.value = [...classes.value, ...colorVariant];

    return { classes };
  },
};
</script>

<style scoped></style>
