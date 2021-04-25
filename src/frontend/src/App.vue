<template>
  <div class="bg-gray-100 h-screen w-screen flex flex-col">
    <TheHeader />
    <div class="flex flex-auto h-full">
      <DirectoryView
        :directories="directoryItems"
        @selection-changed="handleDirectorySelectionChanged"
        @add="handleDirectoryAddRequest"
        @delete="handleDirectoryDeleteRequest"
        @edit="handleDirectoryEditRequest"
      />
      <router-view />
    </div>
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from "@/components/TheHeader";
import TheFooter from "@/components/TheFooter";
import DirectoryView from "@/components/DirectoryView.vue";
import useDirectories from "@/hooks/use-directories";

export default {
  components: { TheHeader, TheFooter, DirectoryView },
  setup() {
    // directory view

    const dirs = useDirectories();
    const directoryItems = dirs.getTreeItems();

    const handleDirectorySelectionChanged = (selection) => {
      console.log("Change directory", selection);
    };

    const handleDirectoryAddRequest = () => {
      console.log("Request directory add");
    };

    const handleDirectoryDeleteRequest = (dir) => {
      console.log("Request directory delete", dir);
    };

    const handleDirectoryEditRequest = (dir) => {
      console.log("Request directory edit", dir);
    };

    return {
      directoryItems,
      handleDirectorySelectionChanged,
      handleDirectoryAddRequest,
      handleDirectoryDeleteRequest,
      handleDirectoryEditRequest,
    };
  },
};
</script>

<style scoped></style>
