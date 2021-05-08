import { ref } from "vue";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import dms from "@/api/simple-dms";

const AUTH_COOKIE = "auth";

const authenticated = ref(false);
const user = ref(null);

export default function () {
  // check cookie
  if (Cookies.get(AUTH_COOKIE)) {
    user.value = JSON.parse(Cookies.get(AUTH_COOKIE));
    dms.setBearer(user.value.jwt);
    authenticated.value = true;
  }

  return {
    isAuthenticated: authenticated,
    user,
    setUser: function (u) {
      user.value = u;

      // set cookie
      Cookies.set(AUTH_COOKIE, u, {
        expires: new Date(jwt_decode(u.jwt).exp * 1000),
        sameSite: "Lax",
      });

      authenticated.value = true;
    },
    logout: function () {
      user.value = null;

      // delete cookie
      Cookies.remove(AUTH_COOKIE);

      authenticated.value = false;
    },
  };
}
