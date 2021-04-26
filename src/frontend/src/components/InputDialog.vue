<template>
  <Dialog :visible="show" :header="title" :closable="false">
    <p>{{ message }}</p>

    <div class="mt-6">
      <span class="p-float-label">
        <InputText id="field" type="text" v-model="fieldValue" />
        <label for="field">{{ fieldLabel }}</label>
      </span>
    </div>

    <template #footer>
      <Button label="Cancel" @click="onCancel" class="p-button-text" />
      <Button :label="confirmButtonLabel" @click="onConfirm" />
    </template>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { ref, watch } from "vue";

export default {
  components: { Dialog, Button, InputText },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    message: {
      type: String,
    },
    fieldLabel: {
      type: String,
    },
    confirmButtonLabel: {
      type: String,
      default: "Save",
    },
    defaultValue: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const fieldValue = ref(props.defaultValue);

    watch(
      () => props.show,
      () => {
        fieldValue.value = props.defaultValue;
      }
    );

    const onConfirm = () => {
      emit("confirm", fieldValue.value);
    };

    const onCancel = () => {
      emit("cancel");
    };

    return { onConfirm, onCancel, fieldValue };
  },
};
</script>

<style scoped></style>
