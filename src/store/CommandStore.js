import { defineStore } from "pinia";
import { v4 } from "uuid";

export const useCommandStore = defineStore("CommandStore", {
  state: () => {
    return {
      commandList: [],
    };
  },
  actions: {
    register(config) {
      if (
        this.commandList.filter((command) => command.title === config.title)
          .length
      ) {
        return;
      }
      this.commandList.push({
        id: v4(),
        title: config.title,
        description: config.description,
        command: config.function,
      });
    },
  },
});
