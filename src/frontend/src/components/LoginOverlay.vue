<template>
  <div
    v-show="show"
    class="w-full h-5/6 bg-gray-100 z-50 absolute flex justify-center"
  >
    <div class="w-1/5 flex flex-col justify-center">
      <span class="font-bold text-4xl text-gray-700">Sign In</span>
      <div class="flex flex-col mb-2 mt-8">
        <span class="text-gray-700 font-semibold mb-1">Username</span>
        <InputField v-model="username" @keyup="handleEnter" />
      </div>

      <div class="flex flex-col mb-4">
        <span class="text-gray-700 font-semibold mb-1">Password</span>
        <InputField type="password" v-model="password" @keyup="handleEnter" />
      </div>

      <div class="flex justify-end">
        <Button
          variant="gray"
          class="w-32"
          :loading="buttonLoading"
          @click="onSignIn"
          >Sign In</Button
        >
      </div>
    </div>
  </div>
</template>

<script>
import InputField from "@/components/toolkit/InputField.vue";
import Button from "@/components/toolkit/Button.vue";
import { ref } from "vue";

export default {
  components: {
    InputField,
    Button,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["sign-in"],
  setup(props, { emit }) {
    const username = ref("");
    const password = ref("");
    const buttonLoading = ref(false);

    const handleEnter = (event) => {
      if (event.keyCode === 13) {
        onSignIn();
      }
    };

    const onSignIn = () => {
      buttonLoading.value = !buttonLoading.value;
      emit("sign-in", { username: username.value, password: password.value });
    };

    return {
      username,
      password,
      buttonLoading,
      onSignIn,
      handleEnter,
    };
  },
};
</script>

<style scoped></style>
