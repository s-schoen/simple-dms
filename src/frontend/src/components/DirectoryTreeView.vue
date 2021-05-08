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
    <transition-group tag="div" name="expand">
      <div v-for="dir in directories" :key="dir.id">
        <DirectoryTreeItem
          :item="dir"
          :selected="selected"
          @select="onItemClick"
          @move="onMoveDirectory"
        />
      </div>
    </transition-group>
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
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["selection-changed", "add", "delete", "edit", "move"],
  setup(props, { emit }) {
    const onItemClick = (id) => {
      emit("selection-changed", id);
    };
    const onAddDirectory = () => {
      emit("add");
    };

    const onDeleteDirectory = () => {
      if (props.selected !== null) {
        emit("delete");
      }
    };

    const onEditDirectory = () => {
      if (props.selected !== null) {
        emit("edit");
      }
    };

    const onMoveDirectory = (val) => {
      emit("move", val);
    };

    return {
      onItemClick,
      onAddDirectory,
      onDeleteDirectory,
      onEditDirectory,
      onMoveDirectory,
    };
  },
};
</script>

<style scoped>
.expand-enter-from {
  opacity: 0.6;
  transform: scale(0.1);
}

.expand-enter-to {
  opacity: 1;
  transform: scale(1);
}

.expand-enter-active {
  transition: all 0.4s ease;
}

.expand-leave-from {
  opacity: 1;
  transform: scale(1);
}

.expand-leave-to {
  opacity: 0.6;
  transform: scale(0.1);
}

.expand-leave-active {
  transition: all 0.2s ease;
  position: absolute;
}

.expand-move {
  transition: all 0.4s ease;
}
</style>
