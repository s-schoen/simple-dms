<template>
  <div class="bg-gray-500 h-12 w-full flex items-center justify-between">
    <span class="ml-5 font-bold text-white text-2xl">Simple DMS</span>

    <div
      v-if="authenticated"
      class="mr-5 flex items-center cursor-pointer"
      @click="handleMenuToggle"
    >
      <i class="fas fa-user-circle text-3xl text-gray-200" />
      <span class="ml-3 text-white font-semibold text-l">{{
        user.displayName
      }}</span>

      <i class="ml-2 fas fa-caret-down text-gray-200" />

      <div
        v-show="menuVisible"
        class="origin-top-right absolute right-3 mt-20 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
      >
        <a
          href="#"
          class="block px-4 py-2 text-sm text-gray-700"
          role="menuitem"
          @click="handleSignOut"
          ><i class="fas fa-sign-out-alt mr-3" />Sign Out</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import useAuthentication from "@/hooks/use-authentication";
import { ref } from "vue";

export default {
  setup() {
    const auth = useAuthentication();
    const menuVisible = ref(false);

    const handleMenuToggle = () => {
      menuVisible.value = !menuVisible.value;
    };

    const handleSignOut = () => {
      auth.logout();
    };

    return {
      user: auth.user,
      authenticated: auth.isAuthenticated,
      menuVisible,
      handleMenuToggle,
      handleSignOut,
    };
  },
};
</script>

<style scoped></style>
