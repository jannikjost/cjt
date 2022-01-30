import { v4 } from "uuid";
import { getWorkday, updateWorkday } from "./../../api/db";

//TODO save data in indexedDb
const moduleWorktimeTracker = {
  state: () => ({
    // task = { id: v4(), name: "test", times: [], time: 0 }
    workday: {
      time: 0,
      isFinished: true,
      percentage: 0,
      tasks: [],
    },
  }),
  getters: {
    getTaskById: (state) => (taskId) => {
      return state.workday.tasks.find((el) => el.id === taskId);
    },
    getTaskTimeById: (state) => (ids) => {
      return state.workday.tasks
        .find((el) => el.id === ids.taskId)
        .times.find((el) => el.id === ids.taskTimeId);
    },
  },
  mutations: {
    setWorkday(state, workday) {
      state.workday = workday;
    },
    addNewTask(state) {
      state.workday.tasks.push({
        id: v4(),
        name: "",
        times: [{ id: v4() }],
        time: 0,
      });
    },
    renameTask(state, props) {
      for (const task in state.workday.tasks) {
        if (task.id === props.id) {
          task.name = props.newName;
          return;
        }
      }
    },
    calculateWorktime(state) {
      let tempWorkTime = 0;
      state.workday.tasks.forEach((element) => {
        tempWorkTime += element.time;
      });
      state.workday.time = tempWorkTime;
      state.workday.percentage =
        state.workday.time > 0 ? 8 / state.workday.time : 0;

      return state.workday.time;
    },
    startStopWorkDay(state, prop) {
      //progress animation does not work with 0 percentage
      if (prop && state.workday.percentage === 0) {
        state.workday.percentage = 10;
      }
      state.workday.isFinished = !prop;
    },
    stopWorkTime(state, props) {
      const task = state.workday.tasks.find((el) => el.id === props.taskId);
      const time = task.times.find((el) => el.id === props.taskTimeId);
      time.time = props.time;
      time.stopTime = props.stopTime;
      let tempTime = 0;
      //TODO negative times
      task.times.forEach((el) => {
        if (!el.time) {
          return;
        }
        tempTime += el.time;
      });
      task.time = tempTime;
    },
    setStartTime(state, props) {
      const task = state.workday.tasks.find((el) => el.id === props.taskId);
      const time = task.times.find((el) => el.id === props.taskTimeId);
      time.startTime = props.startTime;
    },
    addNewTaskTime(state, taskId) {
      const task = state.workday.tasks.find((el) => el.id === taskId);
      if (task.times.at(-1).startTime) {
        task.times.push({
          id: v4(),
        });
      }
    },
    removeTaskWorkTime(state, props) {
      const task = state.workday.tasks.find((el) => el.id === props.taskId);
      task.times.forEach((element, index) => {
        if (element.id === props.taskTimeId) {
          if (element.time) task.time -= element.time;
          task.times.splice(index, 1);
        }
      });
    },
    resetTaskWorkTime(state, props) {
      const task = state.workday.tasks.find((el) => el.id === props.taskId);
      const time = task.times.find((el) => el.id === props.taskTimeId);
      if (time.time) task.time -= time.time;
      delete time.time;
      delete time.startTime;
      delete time.stopTime;
    },
    removeTask(state, id) {
      state.workday.tasks.forEach((el, i) => {
        if (el.id === id) {
          state.workday.tasks.splice(i, 1);
        }
      });
    },
    resetTask(state, id) {
      state.workday.tasks.forEach((el) => {
        if (el.id === id) {
          el.name = "";
          el.time = 0;
          el.times = [{ id: v4() }];
        }
      });
    },
    resetAll(state) {
      state.workday = {
        time: 0,
        isFinished: true,
        percentage: 0,
        tasks: [
          {
            id: v4(),
            name: "",
            times: [{ id: v4() }],
            time: 0,
          },
        ],
      };
    },
  },
  actions: {
    async loadWorkday(context) {
      try {
        //TODO need way to delete workday
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
        context.commit("setWorkday", parsedWorkday);
      } catch {
        throw new Error();
      }
    },
    async addNewTask(context) {
      context.commit("addNewTask");
      //TODO exception handling
      return await updateWorkday(context.state.workday);
    },
    async changeTaskName(context, props) {
      context.commit("renameTask", props);
      //TODO exception handling
      return await updateWorkday(context.state.workday);
    },
    async startWorkTime(context, prop) {
      context.commit("startStopWorkDay", prop);
      context.commit("setStartTime", {
        taskId: prop.taskId,
        taskTimeId: prop.taskTimeId,
        startTime: prop.startTime,
      });
      //TODO exception handling
      return await updateWorkday(context.state.workday);
    },
    async finishWorkDay(context) {
      context.commit("calculateWorktime");
      //TODO exception handling
      return await updateWorkday(context.state.workday);
    },
    async stopTaskWorkTime(context, props) {
      context.commit("stopWorkTime", props);
      context.commit("calculateWorktime");
      context.commit("startStopWorkDay", false);
      context.commit("addNewTaskTime", props.taskId);

      //TODO exception handling
      return await updateWorkday(context.state.workday);
    },
    async removeTaskWorkTime(context, props) {
      const task = context.getters.getTaskById(props.taskId);
      if (task.times.length > 1) {
        context.commit("removeTaskWorkTime", props);
      } else {
        context.commit("resetTaskWorkTime", props);
      }
      context.commit("calculateWorktime");
      //TODO exception handling
      return await updateWorkday(context.state.workday);
    },
    async removeTask(context, id) {
      context.commit("removeTask", id);
      context.commit("calculateWorktime");
      //TODO exception handling
      return await updateWorkday(context.state.workday);
    },
    async resetTask(context, id) {
      context.commit("resetTask", id);
      context.commit("calculateWorktime");
      //TODO exception handling
      return await updateWorkday(context.state.workday);
    },
    async resetAll(context) {
      context.commit("resetAll");
      //TODO exception handling
      return await updateWorkday(context.state.workday);
    },
  },
};

export default moduleWorktimeTracker;
