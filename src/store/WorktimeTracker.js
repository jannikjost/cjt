import { v4 } from "uuid";
import { reactive, computed } from "vue";
import { getWorkday, updateWorkday } from "../api/db";
import TimeStore from "./Time";

const state = reactive({
  // task = { id: v4(), name: "test", times: [], time: 0 }
  workday: {
    time: 0,
    isFinished: true,
    percentage: 0,
    tasks: [],
  },
});

const workday = computed(() => state.workday);
const hasTasks = computed(() => state.workday.tasks.length > 0);
const tasks = computed(() => state.workday.tasks);
const worktime = computed(() => state.workday.time);
const percentage = computed(() => state.workday.percentage);
const isFinished = computed(() => state.workday.isFinished);

function GetTaskById(taskId) {
  return state.workday.tasks.find((el) => el.id === taskId);
}

function SetWorkday(workday) {
  state.workday = workday;
}

async function LoadWorkday() {
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
    SetWorkday(parsedWorkday);
  } catch {
    throw new Error();
  }
}

async function AddNewTask() {
  state.workday.tasks.push({
    id: v4(),
    name: "",
    times: [{ id: v4() }],
    time: 0,
  });
  //TODO exception handling
  return await updateWorkday(state.workday);
}

async function ChangeTaskName(props) {
  for (const task in state.workday.tasks) {
    if (task.id === props.id) {
      task.name = props.newName;
      return;
    }
  }
  //TODO exception handling
  return await updateWorkday(state.workday);
}

//TODO remove function CalculateWorktime can sync with db
function FinishWorkDay() {
  return CalculateWorkTime();
}

async function ResetAll() {
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
  //TODO exception handling
  return await updateWorkday(state.workday);
}

function ResetTask(id) {
  state.workday.tasks.forEach((el) => {
    if (el.id === id) {
      el.name = "";
      el.time = 0;
      el.times = [{ id: v4() }];
    }
  });

  return CalculateWorkTime();
}

function RemoveTask(id) {
  state.workday.tasks.forEach((el, i) => {
    if (el.id === id) {
      state.workday.tasks.splice(i, 1);
    }
  });
  //? already syncs

  return CalculateWorkTime();
}

function CalculateProgress(prop) {
  //progress animation does not work with 0 percentage
  if (prop && state.workday.percentage === 0) {
    state.workday.percentage = 10;
  }
  state.workday.isFinished = !prop;
}

function CalculateTaskTime(taskId) {
  const task = GetTaskById(taskId);
  let tempTime = 0;
  //TODO negative times
  task.times.forEach((el) => {
    if (!el.time) {
      return;
    }
    tempTime += el.time;
  });
  task.time = tempTime;
}

function CalculateWorkTime() {
  let tempWorkTime = 0;
  state.workday.tasks.forEach((element) => {
    tempWorkTime += element.time;
  });
  state.workday.time = tempWorkTime;
  state.workday.percentage =
    state.workday.time > 0 ? 8 / state.workday.time : 0;

  return updateWorkday(state.workday);
}

export {
  workday,
  hasTasks,
  tasks,
  worktime,
  percentage,
  isFinished,
  GetTaskById,
  LoadWorkday,
  AddNewTask,
  ChangeTaskName,
  CalculateProgress,
  FinishWorkDay,
  ResetAll,
  ResetTask,
  RemoveTask,
  TimeStore,
  CalculateWorkTime,
  CalculateTaskTime,
};
