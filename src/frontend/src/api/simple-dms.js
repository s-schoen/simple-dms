import axios from "axios";
import jwt_decode from "jwt-decode";

const BASE_URL = "http://localhost:3000/api";
axios.defaults.baseURL = BASE_URL;

// Debug: log request
// axios.interceptors.request.use((request) => {
//   console.log("REQUEST", JSON.stringify(request, null, 2));
// });

export default {
  // Users and Authentication
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
  // Directory API
  fetchDirectories: function () {
    return new Promise((resolve, reject) => {
      axios
        .get("/dirs")
        .then((resp) => resolve(resp.data))
        .catch((error) => reject(error));
    });
  },
  insertDirectory: function (dir) {
    return new Promise((resolve, reject) => {
      axios
        .post("/dirs", dir)
        .then((resp) => resolve(resp.data))
        .catch((error) => reject(error));
    });
  },
  updateDirectory: function (update) {
    return new Promise((resolve, reject) => {
      axios
        .put(`/dirs/${update.id}`, update)
        .then((resp) => resolve(resp.data))
        .catch((error) => reject(error));
    });
  },
  deleteDirectory: function (id) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`/dirs/${id}`)
        .then((resp) => resolve(resp.data))
        .catch((error) => reject(error));
    });
  },
  // Document API
  fetchDocuments: function () {
    return new Promise((resolve, reject) => {
      axios
        .get("/docs")
        .then((resp) => resolve(resp.data))
        .catch((error) => reject(error));
    });
  },
  fetchDocument: function (docId) {
    return new Promise((resolve, reject) => {
      axios
        .get(`/docs/${docId}`)
        .then((resp) => resolve(resp.data))
        .catch((error) => reject(error));
    });
  },
  insertDocument: function (documentData, documentFile) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();

      formData.append("data", JSON.stringify(documentData));
      formData.append("pdf", documentFile);

      axios({
        method: "POST",
        url: "/docs",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((resp) => resolve(resp.data))
        .catch((error) => reject(error));
    });
  },
  updateDocument: function (documentDataUpdate, documentFileUpdate = null) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();

      formData.append("data", JSON.stringify(documentDataUpdate));

      if (documentFileUpdate !== null) {
        formData.append("pdf", documentFileUpdate);
      }

      axios({
        method: "PUT",
        url: `/docs/${documentDataUpdate.id}`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((resp) => resolve(resp.data))
        .catch((error) => reject(error));
    });
  },
  deleteDocument: function (docId) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`/docs/${docId}`)
        .then((resp) => resolve(resp.data))
        .catch((error) => reject(error));
    });
  },
};
