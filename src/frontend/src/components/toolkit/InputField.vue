<template>
  <input
    id="field"
    :type="type"
    :value="modelValue"
    class="h-10 w-full border-gray-300 px-2 border rounded-md focus:border-blue-400 focus:outline-none"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
export default {
  props: {
    modelValue: {},
    type: {
      type: String,
      default: "text",
    },
  },
  setup() {
    return {};
  },
};
</script>

<style scoped></style>
