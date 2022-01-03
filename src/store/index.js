import { createStore } from "vuex";
import moduleOvertime from "./modules/Overtime";
import moduleWorktimeTracker from "./modules/WorktimeTracker";

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: { moduleOvertime, moduleWorktimeTracker },
});
