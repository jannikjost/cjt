import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import installElementPlus from "./plugins/element";
import "element-plus/theme-chalk/src/message.scss";
import { createDataBase } from "./api/db";
import { createPinia } from "pinia";

createDataBase()
  .then(() => {
    const app = createApp(App);
    installElementPlus(app);
    app.use(createPinia());
    app.use(router).mount("#app");
  })
  .catch(() => {
    console.error("Fatal Error: Connection to indexedDb failed");
  });
