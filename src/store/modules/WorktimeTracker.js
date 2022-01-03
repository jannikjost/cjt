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
    changeTaskName(context, props) {
      return new Promise((resolve, reject) => {
        context.commit("renameTask", props);
        //TODO sync with db
        resolve();
        reject();
      });
    },
    startStopWorkDay(context, prop) {
      context.commit("startStopWorkDay", prop);
      //TODO sync with db
    },
    finishWorkDay(context) {
      //TODO implement
      context.commit("calculateWorktime");
      //TODO sync with db
    },
    addNewTaskTime(context, taskId) {
      context.commit("addNewTaskTime", taskId);
      //TODO sync with db
    },
  },
};

export default moduleWorktimeTracker;
