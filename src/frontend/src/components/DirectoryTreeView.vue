<template>
  <div class="w-96">
    <div class="h-12 bg-gray-200 flex items-center justify-end p-4">
      <i
        :class="[
          'ml-5',
          'fas',
          'fa-folder-minus',
          { 'btn-icon': selected !== null },
          { 'btn-icon-disabled': selected === null },
        ]"
        @click="onDeleteDirectory"
      />
      <i
        :class="[
          'ml-5',
          'fas',
          'fa-pencil-alt',
          { 'btn-icon': selected !== null },
          { 'btn-icon-disabled': selected === null },
        ]"
        @click="onEditDirectory"
      />
      <i class="ml-5 fas fa-folder-plus btn-icon" @click="onAddDirectory" />
    </div>
    <div class="">
      <div v-for="dir in directories" :key="dir.id">
        <DirectoryTreeItem
          :item="dir"
          :selected="selected"
          @select="onItemClick"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DirectoryTreeItem from "@/components/DirectoryTreeItem";

export default {
  components: { DirectoryTreeItem },
  props: {
    directories: {
      type: Array,
    },
    selected: {
      type: String,
    },
  },
  emits: ["selection-changed", "add", "delete", "edit"],
  setup(props, { emit }) {
    const onItemClick = (id) => {
      emit("selection-changed", id);
    };
    const onAddDirectory = () => {
      emit("add");
    };

    const onDeleteDirectory = () => {
      console.log("CLICK");
      if (props.selected !== null) {
        emit("delete");
      }
    };

    const onEditDirectory = () => {
      if (props.selected !== null) {
        emit("edit");
      }
    };

    return {
      onItemClick,
      onAddDirectory,
      onDeleteDirectory,
      onEditDirectory,
    };
  },
};
</script>

<style scoped></style>
