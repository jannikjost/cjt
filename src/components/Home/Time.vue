<template>
  <div class="time">
    <el-time-picker
      v-model="startDate"
      placeholder="Start time"
      @change="StartTimeChange"
      :format="'HH:mm'"
    />
    <el-time-picker
      v-model="stopDate"
      placeholder="Stop time"
      @change="StopTimeChanged"
      :format="'HH:mm'"
    />
    <el-button @click="startStopWorktime">{{ buttonText }}</el-button>
    <el-button @click="RemoveWorkTime" :disabled="isDisabled">x</el-button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useWorkdayStore } from "../../store/WorkdayStore";

const emit = defineEmits()
const props = defineProps({
  taskId: String,
  id: String,
  startTime2: Object,
  stopTime2: Object,
});

const workdayStore = useWorkdayStore();
const startDate = ref(props.startTime2);
const stopDate = ref(props.stopTime2);

const isDisabled = computed(() => {
  // ensure that always at least one time exists
  return workdayStore.getTaskByTimeId(props.id).times.length === 1;
});

const buttonText = computed(() => {
  if (startDate.value && stopDate.value) {
    return "new";
  }
  if (startDate.value) {
    return "stop";
  }
  return "start";
});

function startStopWorktime() {
  if (buttonText.value === "new") {
    emit("addworktime");
    return;
  }
  if (startDate.value) {
    stopDate.value = new Date();
    workdayStore.stopTime({
      taskId: props.taskId,
      timeId: props.id,
      stopTime: stopDate.value,
      time: CalculateTimeDifference(),
    });
    return;
  }

  startDate.value = new Date();
  workdayStore.startTime({
    taskId: props.taskId,
    timeId: props.id,
    startTime: startDate.value,
  });
}

function StopTimeChanged() {
  workdayStore.stopTime({
    taskId: props.taskId,
    timeId: props.id,
    stopTime: stopDate.value,
    time: CalculateTimeDifference(),
  });
}

function StartTimeChange() {
  workdayStore.updateStartTime({
    taskId: props.taskId,
    timeId: props.id,
    time: CalculateTimeDifference(),
    startTime: startDate.value,
  });
}

function CalculateTimeDifference() {
  if (!startDate.value || !stopDate.value) return 0;
  const hours = stopDate.value.getHours() - startDate.value.getHours();
  const minutes = stopDate.value.getMinutes() - startDate.value.getMinutes();

  const minutesDiff = minutes + hours * 60;
  return minutesDiff;
}

function RemoveWorkTime() {
  //?
  startDate.value = "";
  stopDate.value = "";
  //TODO porps.id should be enough
  emit("removeworktime", props);
}
</script>

<style lang="scss" scoped>
.time {
  display: flex;
  flex-direction: row;
}
</style>
