import axios from "axios";
import jwt_decode from "jwt-decode";

const BASE_URL = "http://localhost:3000/api";
axios.defaults.baseURL = BASE_URL;

// Debug: log request
// axios.interceptors.request.use((request) => {
//   console.log("REQUEST", JSON.stringify(request, null, 2));
// });

export default {
  setBearer: function (token) {
    axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
  },
  authenticate: function (username, password) {
    return new Promise((resolve, reject) => {
      axios
        .post("/auth", { username, password })
        .then((resp) => {
          resolve({ ...jwt_decode(resp.data.token), token: resp.data.token });
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getUserInfo: function (username) {
    return new Promise((resolve, reject) => {
      axios
        .get(`/users/${username}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((error) => reject(error));
    });
  },
};
