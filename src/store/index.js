import { createStore } from "vuex";
import moduleOvertime from "./modules/Overtime";
import moduleWorktimeTracker from "./modules/WorktimeTracker";
import moduleTimes from "./modules/Times";

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: { moduleOvertime, moduleWorktimeTracker, moduleTimes },
});
