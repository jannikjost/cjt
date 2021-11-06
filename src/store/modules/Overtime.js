import { getData, addEntry } from "./../../api/db";

const moduleOvertime = {
  state: () => ({
    overtime: [],
  }),
  getters: {},
  mutations: {
    loadOvertime(state, overtime) {
      overtime.sort((a, b) => {
        return b.date - a.date;
      });
      state.overtime = overtime;
    },
    addOvertime(state, overtime) {
      state.overtime.unshift(overtime);
    },
  },
  actions: {
    async loadData({ commit, state }) {
      if (state.overtime.length) {
        return;
      }
      const res = await getData();
      commit("loadOvertime", res);
    },
    async addOvertime({ commit }, overtime) {
      try {
        await addEntry(overtime);
        commit("addOvertime", overtime);
        return;
      } catch {
        console.error("Adding overtime went wrong");
        return;
      }
    },
  },
};

export default moduleOvertime;
