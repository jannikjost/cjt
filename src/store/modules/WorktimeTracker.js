import { v4 } from "uuid";
import { getWorkday, updateWorkday } from "./../../api/db";

import { reactive, computed } from "vue";

const state = reactive({
  // task = { id: v4(), name: "test", times: [], time: 0 }
  workday: {
    time: 0,
    isFinished: true,
    percentage: 0,
    tasks: [],
  },
});

const hasTasks = computed(() => state.workday.tasks.length > 0);
const tasks = computed(()=>state.workday.tasks)
const worktime = computed(()=>state.workday.time);
const percentage = computed(()=>state.workday.percentage)
const isFinished = computed(()=> state.workday.isFinished)

function GetTaskById(taskId) {
  return state.workday.tasks.find((el) => el.id === taskId);
}

function GetTaskTimeById(id) {
  return state.workday.tasks
    .find((el) => el.id === id.taskId)
    .times.find((el) => el.id === id.taskTimeId);
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

async function StartWorkTime(prop) {
  StartStopWorkDay(prop);
  const task = state.workday.tasks.find((el) => el.id === prop.taskId);
  const time = task.times.find((el) => el.id === prop.taskTimeId);
  time.startTime = prop.startTime;
  //TODO exception handling
  return await updateWorkday(state.workday);
}

function StartStopWorkDay(prop) {
  //progress animation does not work with 0 percentage
  if (prop && state.workday.percentage === 0) {
    state.workday.percentage = 10;
  }
  state.workday.isFinished = !prop;
}

//TODO remove function CalculateWorktime can sync with db
async function FinishWorkDay() {
  CalculateWorktime();
  //TODO exception handling
  return await updateWorkday(state.workday);
}

function CalculateWorktime() {
  let tempWorkTime = 0;
  state.workday.tasks.forEach((element) => {
    tempWorkTime += element.time;
  });
  state.workday.time = tempWorkTime;
  state.workday.percentage =
    state.workday.time > 0 ? 8 / state.workday.time : 0;

  return state.workday.time;
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

async function ResetTask(id) {
  state.workday.tasks.forEach((el) => {
    if (el.id === id) {
      el.name = "";
      el.time = 0;
      el.times = [{ id: v4() }];
    }
  });
  //? already syncs
  CalculateWorktime();
  //TODO exception handling
  return await updateWorkday(state.workday);
}

async function RemoveTask(id) {
  state.workday.tasks.forEach((el, i) => {
    if (el.id === id) {
      state.workday.tasks.splice(i, 1);
    }
  });
  //? already syncs
  CalculateWorktime();
  //TODO exception handling
  return await updateWorkday(state.workday);
}

async function RemoveTaskWorkTime(props) {
  const task = GetTaskById(props.taskId);
  if (task.times.length > 1) {
    const task = state.workday.tasks.find((el) => el.id === props.taskId);
    task.times.forEach((element, index) => {
      if (element.id === props.taskTimeId) {
        if (element.time) task.time -= element.time;
        task.times.splice(index, 1);
      }
    });
  } else {
    const task = state.workday.tasks.find((el) => el.id === props.taskId);
    const time = task.times.find((el) => el.id === props.taskTimeId);
    if (time.time) task.time -= time.time;
    delete time.time;
    delete time.startTime;
    delete time.stopTime;
  }
  //? already syncs
  CalculateWorktime();
  //TODO exception handling
  return await updateWorkday(state.workday);
}

async function StopTaskWorkTime(props) {
  StopWorkTime(props);
  //? already syncs, call at end
  CalculateWorktime();
  StartStopWorkDay(false);

  //TODO exception handling
  return await updateWorkday(state.workday);
}

function StopWorkTime(props) {
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
}

export {
  hasTasks,
  tasks,
  worktime,
  percentage,
  isFinished,
  GetTaskById,
  GetTaskTimeById,
  LoadWorkday,
  AddNewTask,
  ChangeTaskName,
  StartWorkTime,
  StartStopWorkDay,
  FinishWorkDay,
  ResetAll,
  ResetTask,
  RemoveTask,
  RemoveTaskWorkTime,
  StopTaskWorkTime,
  StopWorkTime,
};
