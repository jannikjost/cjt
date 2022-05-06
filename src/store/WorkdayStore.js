import { defineStore } from "pinia";
import { v4 } from "uuid";
import { getWorkday, updateWorkday } from "../api/db";
import { useCommandStore } from "./CommandStore.js";

export const useWorkdayStore = defineStore("workday", {
  state: () => {
    return {
      date: "",
      time: 0,
      isFinished: true,
      percentage: 0,
      // task = { id: v4(), name: "test", times: [], time: 0 }
      tasks: [],
    };
  },
  getters: {
    hasTasks: (state) => state.tasks.length > 0,
    hastMoreThanOneTask: (state) => state.tasks.length > 1,
    getTaskById: (state) => {
      return (id) => state.tasks.find((task) => task.id === id);
    },
    getTimeById: (state) => {
      return (ids) =>
        state.tasks
          .find((el) => el.id === ids.taskId)
          .times.find((el) => el.id === ids.timeId);
    },
    getTaskByTimeId: (state) => {
      return (id) =>
        state.tasks.find((task) => {
          return task.times.find((time) => time.id === id);
        });
    },
  },
  actions: {
    setWorkday(workday) {
      this.date = workday.date;
      this.time = workday.time;
      this.isFinished = workday.isFinished;
      this.percentage = workday.percentage;
      this.tasks = workday.tasks;
    },
    async hydrate() {
      const savedWorkday = await getWorkday();
      if (!savedWorkday) return;
      let parsedWorkday = JSON.parse(savedWorkday.workday);
      //convert dates to Date objects
      parsedWorkday.tasks = parsedWorkday.tasks.map((task) => {
        task.times = task.times.map((time) => {
          if (time.startTime) time.startTime = new Date(time.startTime);
          if (time.stopTime) time.stopTime = new Date(time.stopTime);
          return time;
        });
        return task;
      });
      this.setWorkday(parsedWorkday);
      this.addCommands();
      //make sure always one task exists
      if (this.hasTasks) return;
      this.addTask();

    },
    async dehydrate() {
      this.$reset();
      return updateWorkday(this.$state);
    },
    addTask() {
      this.tasks.push({
        id: v4(),
        name: "",
        times: [{ id: v4() }],
        time: 0,
      });
      return updateWorkday(this.$state);
    },
    renameTask(id, newName) {
      const task = this.getTaskById(id);
      if (!task) return;
      task.name = newName;
      return updateWorkday(this.$state);
    },

    resetTask(id) {
      const task = this.getTaskById(id);
      if (!task) return;
      task.name = "";
      task.time = 0;
      task.times = [{ id: v4() }];
      return this.calculateWorkTime();
    },
    removeTask(id) {
      this.tasks.forEach((el, i) => {
        if (el.id === id) {
          this.tasks.splice(i, 1);
        }
      });

      return this.calculateWorkTime();
    },
    calculateProgress(prop) {
      //progress animation does not work with 0 percentage
      if (prop && this.percentage === 0) {
        this.percentage = 10;
      }
      this.isFinished = !prop;
    },
    calculateTaskTime(id) {
      const task = this.getTaskById(id);
      if (!task) return;
      let tempTime = 0;
      task.times.forEach((el) => {
        if (!el.time) {
          return;
        }
        tempTime += el.time;
      });
      task.time = tempTime;
    },
    calculateWorkTime() {
      let tempWorkTime = 0;
      this.tasks.forEach((element) => {
        tempWorkTime += element.time;
      });
      this.time = tempWorkTime;
      this.percentage = this.time > 0 ? 8 / this.time : 0;

      return updateWorkday(this.$state);
    },

    // time
    updateStartTime(props) {
      const time = this.getTimeById({
        taskId: props.taskId,
        timeId: props.timeId,
      });
      time.time = props.time;
      time.startTime = props.startTime;

      this.calculateProgress(false);
      this.calculateTaskTime(props.taskId);

      return this.calculateWorkTime();
    },
    startTime(props) {
      const time = this.getTimeById({
        taskId: props.taskId,
        timeId: props.timeId,
      });
      if (!time.stopTime) {
        this.calculateProgress(props);
      }
      time.startTime = props.startTime;

      return updateWorkday(workday.value);
    },
    stopTime(params) {
      const time = this.getTimeById({
        taskId: props.taskId,
        timeId: props.timeId,
      });
      time.time = params.time;
      time.stopTime = params.stopTime;

      this.calculateProgress(false);
      this.calculateTaskTime(params.taskId);

      return this.calculateWorkTime();
    },
    addTime(id) {
      const task = GetTaskById(id);
      task.times.push({ id: v4() });

      return updateWorkday(workday.value);
    },
    removeTime(props) {
      const task = GetTaskById(props.taskId);
      if (task.times.length > 1) {
        task.times.forEach((element, index) => {
          if (element.id === props.taskTimeId) {
            if (element.time) task.time -= element.time;
            task.times.splice(index, 1);
          }
        });
      } else {
        const time = task.times.find((el) => el.id === props.taskTimeId);
        if (time.time) task.time -= time.time;
        delete time.time;
        delete time.startTime;
        delete time.stopTime;
      }

      return this.calculateWorkTime();
    },

    addCommands() {
      const commandStore = useCommandStore();
      commandStore.register({
        title: "Mittagspause",
        description: "Not implemented",
        command: () => {},
      });

      commandStore.register({
        title: "Stop all",
        description: "Not implemented",
        command: () => {},
      });
    },
  },
});
