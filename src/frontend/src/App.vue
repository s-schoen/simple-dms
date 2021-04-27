<template>
  <ConfirmDialog />
  <InputDialog
    :show="inputDialogVisible"
    :title="inputDialogData.title"
    :message="inputDialogData.message"
    :fieldLabel="inputDialogData.fieldLabel"
    :confirmButtonLabel="inputDialogData.confirmButtonLabel"
    :defaultValue="inputDialogData.value"
    @cancel="inputDialogVisible = false"
    @confirm="inputDialogData.onConfirm"
  />
  <div class="bg-gray-100 h-screen w-screen flex flex-col">
    <TheHeader />
    <div class="flex flex-auto h-full">
      <DirectoryTreeView
        :directories="directoryItems"
        :selected="selectedDirectory ? selectedDirectory.id : null"
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
import InputDialog from "@/components/InputDialog";
import DirectoryTreeView from "@/components/DirectoryTreeView";
import useDirectories from "@/hooks/use-directories";
import { useConfirm } from "primevue/useconfirm";
import { ref } from "vue";

export default {
  components: {
    TheHeader,
    TheFooter,
    ConfirmDialog,
    InputDialog,
    DirectoryTreeView,
  },
  setup() {
    const confirm = useConfirm();

    const inputDialogVisible = ref(false);
    const inputDialogData = ref({
      title: "",
      message: "",
      fieldLabel: "",
      confirmButtonLabel: "",
      value: "",
      onConfirm: () => {},
    });

    // directory view

    const dirs = useDirectories();
    const directoryItems = dirs.directoryTree;
    const selectedDirectory = dirs.selectedDirectory;

    const handleDirectorySelectionChanged = (selection) => {
      dirs.select(selection);
    };

    const handleDirectoryAddRequest = () => {
      inputDialogData.value = {
        title: "Add Directory",
        message: "",
        fieldLabel: "Directory Name",
        confirmButtonLabel: "Create",
        value: "",
        onConfirm: (val) => {
          const parent =
            dirs.selectedDirectory.value === null
              ? null
              : dirs.selectedDirectory.value.id;

          dirs.createDirectory(val, parent);

          inputDialogVisible.value = false;
        },
      };
      inputDialogVisible.value = true;
    };

    const handleDirectoryDeleteRequest = (dir) => {
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

    const handleDirectoryEditRequest = () => {
      const selected = dirs.selectedDirectory.value;

      inputDialogData.value = {
        title: "Add Directory",
        message: "",
        fieldLabel: "Directory Name",
        confirmButtonLabel: "Create",
        value: selected.name,
        onConfirm: (val) => {
          dirs.updateDirectory({ ...selected, name: val });
          inputDialogVisible.value = false;
        },
      };
      inputDialogVisible.value = true;
    };

    return {
      inputDialogVisible,
      inputDialogData,
      directoryItems,
      selectedDirectory,
      handleDirectorySelectionChanged,
      handleDirectoryAddRequest,
      handleDirectoryDeleteRequest,
      handleDirectoryEditRequest,
    };
  },
};
</script>

<style scoped></style>
