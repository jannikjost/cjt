import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import installElementPlus from "./plugins/element";
import { createDataBase } from "./api/db";

createDataBase()
  .then(() => {
    const app = createApp(App);
    installElementPlus(app);
    app
      .use(store)
      .use(router)
      .mount("#app");
  })
  .catch(() => {
    console.error("Fatal Error: Connection to indexedDb failed");
  });
