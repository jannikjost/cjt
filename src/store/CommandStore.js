import { defineStore } from "pinia";
import { v4 } from "uuid";

export const useCommandStore = defineStore("CommandStore", {
  state: () => ({
    commandList: [
      {
        id: v4(),
        title: "test",
        function: () => {
          console.log("test called");
        },
        description: "only a test command",
      },
      {
        id: v4(),
        title: "test2",
        function: () => {
          console.log("test2 called");
        },
        description: "only a test command",
      },
    ],
  }),
  actions: {
    register: (config) => {
      state.commandList.push({
        id: config.id,
        title: config.title,
        description: config.description,
        function: config.function,
      });
    },
  },
});
