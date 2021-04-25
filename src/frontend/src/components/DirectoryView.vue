<template>
  <div class="w-80 bg-white h-full">
    <div class="h-12 bg-gray-200 flex items-center justify-end p-4">
      <i class="fas fa-folder-minus btn-icon" @click="onDeleteDirectory" />
      <i class="ml-5 fas fa-pencil-alt btn-icon" @click="onEditDirectory" />
      <i class="ml-5 fas fa-folder-plus btn-icon" @click="onAddDirectory" />
    </div>
    <Tree
      class="h-auto"
      :value="directories"
      selectionMode="single"
      v-model:selectionKeys="selectedDirectory"
    >
      <template #default="slotProps">
        <div class="flex items-center">
          <i class="mr-2 fas fa-folder" />
          <span class="mt-1">{{ slotProps.node.label }}</span>
        </div>
      </template>
    </Tree>
  </div>
</template>

<script>
import Tree from "primevue/tree";
import { ref, watch } from "vue";

export default {
  components: { Tree },
  props: {
    directories: {
      type: Array,
    },
    selection: {
      type: String,
      default: null,
    },
  },
  setup(props, { emit }) {
    const selectedDirectory = ref(props.selection);

    const getDirectoryIdFromSelection = () => {
      return Object.keys(selectedDirectory.value)[0] + "";
    };

    const onAddDirectory = () => {
      emit("add");
    };

    const onDeleteDirectory = () => {
      emit("delete", getDirectoryIdFromSelection());
    };

    const onEditDirectory = () => {
      emit("edit", getDirectoryIdFromSelection());
    };

    watch(selectedDirectory, () => {
      emit("selectionChanged", getDirectoryIdFromSelection());
    });

    return {
      selectedDirectory,
      onAddDirectory,
      onDeleteDirectory,
      onEditDirectory,
    };
  },
};
</script>

<style scoped></style>
