import { v4 } from "uuid";
import {
  workday,
  tasks,
  GetTaskById,
  CalculateProgress,
  CalculateWorkTime,
  CalculateTaskTime,
} from "./WorktimeTracker";
import { updateWorkday } from "../api/db";

function GetTaskTimeById(id) {
  return tasks.value
    .find((el) => el.id === id.taskId)
    .times.find((el) => el.id === id.taskTimeId);
}

function GetTaskByTaskTimeId(id) {
  return tasks.value.find((task) => {
    return task.times.find((time) => time.id === id);
  });
}

function UpdateStartTime(props) {
  const task = GetTaskById(props.taskId);
  const time = task.times.find((el) => el.id === props.timeId);
  time.time = props.time;
  time.startTime = props.startTime;

  CalculateProgress(false);
  CalculateTaskTime(props.taskId);

  return CalculateWorkTime(workday.value);
}

function StartTime(props) {
  const task = GetTaskById(props.taskId);
  const time = task.times.find((el) => el.id === props.timeId);
  if (!time.stopTime) {
    CalculateProgress(props);
  }
  time.startTime = props.startTime;

  return updateWorkday(workday.value);
}

function StopTime(params) {
  const task = GetTaskById(params.taskId);
  const time = task.times.find((el) => el.id === params.timeId);
  time.time = params.time;
  time.stopTime = params.stopTime;

  CalculateProgress(false);
  CalculateTaskTime(params.taskId);

  return CalculateWorkTime(workday.value);
}

function AddTime(id) {
  const task = GetTaskById(id);
  task.times.push({ id: v4() });

  return updateWorkday(workday.value);
}

function RemoveTime(props) {
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

  return CalculateWorkTime();
}

export default {
  GetTaskTimeById,
  GetTaskByTaskTimeId,
  UpdateStartTime,
  StartTime,
  AddTime,
  StopTime,
  RemoveTime,
};
