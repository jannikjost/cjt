<template>
  <el-collapse-item>
    <template #title>
      <el-input
        class="task__title"
        v-model="storeTask.name"
        @change="Debounce(SyncTaskName($event), 250)"
      />
      <label>{{ storeTask.time }}</label>
    </template>
    <div>
      <Time
        v-for="time in storeTaskTimes"
        :key="time.id"
        v-on:startworktime="StartTaskWorkTime"
        v-on:stopworktime="StopTaskWorkTime"
        v-on:removeworktime="RemoveWorkTime"
        :id="time.id"
      />
    </div>
  </el-collapse-item>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import Time from "./Time.vue";
import Debounce from "./../../utils/debounce";
import { ElMessage } from "element-plus";

export default {
  components: { Time },
  props: { id: String },
  setup(props) {
    const store = useStore();

    const storeTask = computed(() => {
      return store.getters.getTaskById(props.id);
    });

    const storeTaskTimes = computed(() => {
      return store.getters.getTaskById(props.id).times;
    });

    function StartTaskWorkTime(params) {
      const time = store.getters.getTaskTimeById({
        taskId: props.id,
        taskTimeId: params.id,
      });
      if (time) {
        time.startTime = params.startTime;
      }
      store.dispatch("startWorkTime", {
        taskId: props.id,
        taskTimeId: params.id,
        startTime: params.startTime,
      });
    }
    function StopTaskWorkTime(params) {
      const time = store.getters.getTaskTimeById({
        taskId: props.id,
        taskTimeId: params.id,
      });
      if (time) {
        time.stopTime = params.stopTime;
        time.time = params.time;
      }
      store.dispatch("stopTaskWorkTime", {
        taskId: props.id,
        taskTimeId: params.id,
        stopTime: params.stopTime,
        time: params.time,
      });
    }
    function RemoveWorkTime(param) {
      if (storeTaskTimes.value.length > 1) {
        storeTaskTimes.value.forEach((element, index) => {
          if (element.id === param.id) {
            storeTaskTimes.value.splice(index, 1);
          }
        });
        //TODO tell store to sync data with db
      }
    }
    async function SyncTaskName(newName) {
      try {
        await store.dispatch("changeTaskName", {
          id: storeTask.value.id,
          newName,
        });
      } catch {
        ElMessage({
          type: "error",
          message: `Rename of Task "${storeTask.value.name}" was not successful`,
        });
        //TODO further logging in db
      }
    }

    return {
      //computed
      storeTask,
      storeTaskTimes,
      //functions
      StartTaskWorkTime,
      StopTaskWorkTime,
      RemoveWorkTime,
      SyncTaskName,
      Debounce,
    };
  },
};
</script>

<style lang="scss" scoped>
.task__title {
  width: 100px;
}
</style>
