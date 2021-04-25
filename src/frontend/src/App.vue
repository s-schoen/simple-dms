<template>
  <ConfirmDialog />
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
import ConfirmDialog from "primevue/confirmdialog";
import TheHeader from "@/components/TheHeader";
import TheFooter from "@/components/TheFooter";
import DirectoryView from "@/components/DirectoryView.vue";
import useDirectories from "@/hooks/use-directories";
import { useConfirm } from "primevue/useconfirm";

export default {
  components: { TheHeader, TheFooter, DirectoryView, ConfirmDialog },
  setup() {
    const confirm = useConfirm();

    // directory view

    const dirs = useDirectories();
    const directoryItems = dirs.directoryMenuItems;

    const handleDirectorySelectionChanged = (selection) => {
      console.log("Change directory", selection);
    };

    const handleDirectoryAddRequest = () => {
      console.log("Request directory add");
    };

    const handleDirectoryDeleteRequest = (dir) => {
      console.log("Request directory delete", dir);
      confirm.require({
        message:
          "Delete directory including all subdirectories? Stored documents are assigned uncategorized.",
        header: "Confirm Directory Deletion",
        icon: "pi pi-exclamation-triangle",
        acceptClass: "p-button-danger",
        accept: () => {
          dirs.deleteDirectory(dir);
        },
        reject: () => {},
      });
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
