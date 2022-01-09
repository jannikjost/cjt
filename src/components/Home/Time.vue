<template>
  <div class="time">
    <el-time-picker
      v-model="startDate"
      placeholder="Start time"
      @change="timeChanged"
      :format="'HH:mm'"
    />
    <el-time-picker
      v-model="stopDate"
      placeholder="Stop time"
      @change="timeChanged"
      :format="'HH:mm'"
    />
    <el-button @click="startStopWorktime">{{ buttonText }}</el-button>
    <el-button @click="removeWorkTime" :disabled="!startDate && !stopDate"
      >x</el-button
    >
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  props: {
    id: String,
    startTime2: Object,
    stopTime2: Object,
  },
  emits: ["removeworktime", "startworktime", "stopworktime"],
  setup(props, { emit }) {
    const startDate = ref(props.startTime2);
    const stopDate = ref(props.stopTime2);

    const buttonText = computed(() => {
      if (startDate.value && stopDate.value) {
        //TODO button state
        return "nothing";
      }
      if (startDate.value) {
        return "stop";
      }
      return "start";
    });

    function startStopWorktime() {
      if (startDate.value) {
        stopDate.value = new Date();
        emit("stopworktime", {
          id: props.id,
          time: calculateTimeDifference(),
          stopTime: stopDate.value,
        });
        return;
      }

      startDate.value = new Date();
      emit("startworktime", { id: props.id, startTime: startDate.value });
    }

    //TODO changing startTime does not work, need seperate function
    function timeChanged() {
      if (startDate.value && stopDate.value) {
        emit("stopworktime", {
          id: props.id,
          time: calculateTimeDifference(),
          stopTime: stopDate.value,
        });
      }
    }

    function calculateTimeDifference() {
      const hours = stopDate.value.getHours() - startDate.value.getHours();
      const minutes =
        stopDate.value.getMinutes() - startDate.value.getMinutes();

      const minutesDiff = minutes + hours * 60;
      return minutesDiff;
    }

    function removeWorkTime() {
      //?
      startDate.value = "";
      stopDate.value = "";
      //TODO porps.id should be enough
      emit("removeworktime", props);
    }

    return {
      startDate,
      stopDate,
      buttonText,
      startStopWorktime,
      removeWorkTime,
      timeChanged,
    };
  },
};
</script>

<style lang="scss" scoped>
.time {
  display: flex;
  flex-direction: row;
}
</style>
