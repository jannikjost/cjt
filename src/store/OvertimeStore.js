import { defineStore } from "pinia";
import { getData, addEntry } from "../api/db";

export const useOvertimeStore = defineStore("overtime", {
  state: () => {
    return {
      overtime: [],
    };
  },
  getters: {
    overtimeExists: (state) => {
      return (date) =>
        state.overtime.filter((el) => {
          return el.date.getTime() === date.getTime();
        }).length;
    },
  },
  actions: {
    async hydrate() {
      const res = await getData();
      res.sort((a, b) => {
        return b.date - a.date;
      });
      this.overtime = res;
    },
    async addOvertime(overtime) {
      await addEntry(overtime);
      this.overtime.unshift(overtime);
      this.overtime.sort((a, b) => {
        return b.date - a.date;
      });
    },
  },
});
