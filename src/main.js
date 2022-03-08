import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { createDataBase } from "./api/db";

createDataBase()
  .then(() => {
    const app = createApp(App);
    app
      .use(router)
      .use(ElementPlus)
      .mount("#app");
  })
  .catch(() => {
    console.error("Fatal Error: Connection to indexedDb failed");
  });
