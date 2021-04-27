<template>
  <div
    :class="[
      'flex',
      'items-center',
      'cursor-pointer',
      'p-4',
      'hover:bg-gray-300',
      'transform',
      'duration-200',
      'ease-in-out',
      'select-none',
      { 'bg-gray-300': selected === item.id },
    ]"
    @click="
      expanded = !expanded;
      onItemClick(item.id);
    "
  >
    <div class="w-4">
      <i
        v-if="item.children.length > 0"
        :class="[
          'fas',
          'text-gray-600',
          'hover:scale-150',
          'transform',
          'duration-200',
          'ease-in-out',
          { 'fa-chevron-right': !expanded },
          { 'fa-chevron-down': expanded },
        ]"
        @click.stop="expanded = !expanded"
      />
    </div>
    <i class="ml-3 fas fa-folder text-xl text-gray-600" />
    <span class="ml-3">{{ item.name }}</span>
  </div>
  <div v-show="expanded" class="ml-5">
    <DirectoryTreeItem
      v-for="dir in item.children"
      :key="dir.id"
      :item="dir"
      @select="onItemClick"
      :selected="selected"
    />
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    item: {
      type: Object,
    },
    selected: {
      type: String,
    },
  },
  emits: ["select"],
  setup(props, { emit }) {
    const expanded = ref(false);

    const onItemClick = (id) => {
      emit("select", id);
    };

    return { onItemClick, expanded };
  },
};
</script>

<style scoped></style>
