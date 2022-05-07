import { defineStore } from "pinia";
import { getData, addEntry } from "../api/db";

export const useOvertimeStore = defineStore("overtime", {
  state: () => {
    return {
      overtimes: [],
    };
  },
  getters: {
    overtimeExists: (state) => {
      return (date) =>
        state.overtimes.filter((el) => {
          return el.date.getTime() === date.getTime();
        }).length;
    },
  },
  actions: {
    async hydrate() {
      let tmp;
      const res = await getData();
      res.sort((a, b) => {
        return a.date - b.date;
      });
      const temp = res.map((el, index) => {
        if (index === 0) {
          tmp = el.minutes;
          return { ...el, overtime: el.minutes };
        }
        tmp += el.minutes
        return {
          ...el,
          overtime: tmp,
        };
      });

      temp.sort((a, b) => {
        return b.date - a.date;
      });
      this.overtimes = temp;
    },
    async addOvertime(overtime) {
      const overtimeToAdd = { ...overtime };
      if (!this.overtimes.length) {
        overtimeToAdd.overtime = overtimeToAdd.minutes;
      } else if (overtime.date > this.overtimes[0].date) {
        overtimeToAdd.overtime =
          this.overtimes[0].overtime + overtimeToAdd.minutes;
      } else {
        //TODO find nearest date
      }

      await addEntry(overtime);
      this.overtimes.unshift(overtimeToAdd);
      this.overtimes.sort((a, b) => {
        return b.date - a.date;
      });
    },
  },
});
