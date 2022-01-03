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
      placeholder="Start time"
      @change="timeChanged"
      :format="'HH:mm'"
    />
    <el-button @click="startStopWorktime">{{ buttonText }}</el-button>
    <el-button @click="removeWorkTime">x</el-button>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  props: {
    id: String,
  },
  emits: ["removeworktime", "startworktime", "stopworktime"],
  setup(props, { emit }) {
    const startDate = ref();
    const stopDate = ref();

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

    function timeChanged() {
      console.log("change");
      if (startDate.value && stopDate.value) {
        calculateTimeDifference();
        emit("stopworktime", {
          id: props.id,
          time: calculateTimeDifference(),
          stopTime: stopDate.value,
        });
      }
    }

    function calculateTimeDifference() {
      let diff = stopDate.value.getTime() - startDate.value.getTime();
      const hours = Math.trunc(diff / 1000 / 60 / 60);
      diff -= hours * 1000 * 60 * 60;
      const minutes = Math.trunc(diff / 1000 / 60);
      return hours + "," + minutes;
    }

    function removeWorkTime() {
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
