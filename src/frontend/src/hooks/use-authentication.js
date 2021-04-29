import { ref } from "vue";

const authenticated = ref(false);
const user = ref(null);

export default function () {
  return {
    isAuthenticated: authenticated,
    user,
    setUser: function (u) {
      user.value = u;
      authenticated.value = true;
    },
    logout: function () {
      user.value = null;
      authenticated.value = false;
    },
  };
}
