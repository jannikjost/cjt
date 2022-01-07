import { v4 } from "uuid";
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
          task.times.splice(index, 1);
        }
      });
    },
    resetTaskWorkTime(state, props) {
      const task = state.workday.tasks.find((el) => el.id === props.taskId);
      const time = task.times.find((el) => el.id === props.taskTimeId);
      delete time.time;
      delete time.startTime;
      delete time.stopTime;
    },
  },
  actions: {
    async addNewTask(context) {
      context.commit("addNewTask");
      return new Promise((resolve, reject) => {
        //TODO sync with db
        resolve();
        reject();
      });
    },
    changeTaskName(context, props) {
      return new Promise((resolve, reject) => {
        context.commit("renameTask", props);
        //TODO sync with db
        resolve();
        reject();
      });
    },
    startWorkTime(context, prop) {
      context.commit("startStopWorkDay", prop);
      context.commit("setStartTime", {
        taskId: prop.taskId,
        taskTimeId: prop.taskTimeId,
        startTime: prop.startTime,
      });
      //TODO sync with db
    },
    finishWorkDay(context) {
      //TODO implement
      context.commit("calculateWorktime");
      //TODO sync with db
    },
    stopTaskWorkTime(context, props) {
      return new Promise((resolve, reject) => {
        context.commit("stopWorkTime", props);
        context.commit("calculateWorktime");
        context.commit("startStopWorkDay", false);
        context.commit("addNewTaskTime", props.taskId);
        //TODO sync with db
        resolve();
        reject();
      });
    },
    removeTaskWorkTime(context, props) {
      const task = context.getters.getTaskById(props.taskId);
      if (task.times.length > 1) {
        context.commit("removeTaskWorkTime", props);
      } else {
        context.commit("resetTaskWorkTime", props);
      }
    },
  },
};

export default moduleWorktimeTracker;
