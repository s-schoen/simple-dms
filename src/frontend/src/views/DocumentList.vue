<template>
  <Toolbar>
    <template #right>
      <ToolbarIconButton icon="fa-plus-circle" />
    </template>
  </Toolbar>
</template>

<script>
import Toolbar from "@/components/toolkit/Toolbar";
import ToolbarIconButton from "@/components/toolkit/ToolbarIconButton";

export default {
  components: { Toolbar, ToolbarIconButton },
  setup() {
    return {};
  },
};
</script>

<style scoped></style>
