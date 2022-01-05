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
    addNewTask(state, id) {
      state.workday.tasks.push({
        id: v4(),
        name: "",
        times: [{ id }],
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
    //TODO its all fucked
    calculateWorktime(state) {
      state.workday.tasks.forEach((element) => {
        state.workday.time += element.time;
      });
      return state.workday.time;
    },
    startStopWorkDay(state, prop) {
      //TODO on stop get real percentage
      //progress animation does not work with 0 percentage
      if (prop && state.workday.percentage === 0) {
        state.workday.percentage = 10;
      }
      state.workday.isFinished = !prop;
    },
    stopWorkTime(state, props) {
      //TODO times in own store???
      state.workday.tasks = state.workday.tasks.map((task) => {
        if (task.id !== props.taskId) return task;
        return {
          ...task,
          times: task.times.map((el) => {
            if (el.id === props.taskTimeId) {
              el.time = props.time;
              el.stopTime = props.stopTime;
            }
            return el;
          }),
        };
      });
      const task = state.workday.tasks.find((el) => el.id === props.taskId);

      const time = task.times.find((el) => el.id === props.taskTimeId);
      time.time = props.time;
      time.stopTime = props.stopTime;
    },
    addNewTaskTime(state, taskId) {
      const task = state.workday.tasks.find((el) => el.id === taskId);
      task.times.push({
        id: v4(),
        startTime: "",
        stopTime: "",
      });
    },
  },
  actions: {
    async addNewTask(context) {
      const timeId = await context.dispatch("addNewTime");
      context.commit("addNewTask", timeId);
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
      context.dispatch("setStartTime", {
        id: prop.taskTimeId,
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
        context.commit("startStopWorkDay", false);
        context.commit("stopWorkTime", props);
        context.commit("addNewTaskTime", props.taskId);
        //TODO sync with db
        resolve();
        reject();
      });
    },
  },
};

export default moduleWorktimeTracker;
