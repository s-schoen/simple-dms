import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/style/index.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";

createApp(App).use(router).use(PrimeVue).mount("#app");
