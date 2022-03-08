<template>
  <el-collapse-item class="task">
    <template #title>
      <el-input
        class="task__title"
        v-model="storeTask.name"
        @change="Debounce(SyncTaskName($event), 250)"
      />
      <label>{{ formattedTime }}</label>
      <div class="task__delete">
        <el-button type="danger" size="small" @click="RemoveTask">x</el-button>
      </div>
    </template>
    <div>
      <Time
        v-for="time in storeTaskTimes"
        :key="time.id"
        v-on:startworktime="StartTaskWorkTime"
        v-on:stopworktime="StopTaskWorkTime"
        v-on:removeworktime="RemoveWorkTime"
        :id="time.id"
        :startTime2="time.startTime"
        :stopTime2="time.stopTime"
      />
    </div>
  </el-collapse-item>
</template>

<script>
import { computed } from "vue";
import Time from "./Time.vue";
import Debounce from "./../../utils/debounce";
import { ElMessage, ElMessageBox } from "element-plus";
import { convertMinsToHrsMins } from "./../../services/formatter";
import {
  GetTaskById,
  StartWorkTime,
  ChangeTaskName,
} from "@/store/modules/WorktimeTracker.js";

export default {
  components: { Time },
  props: { id: String },
  setup(props) {
    const formattedTime = computed(() => {
      return convertMinsToHrsMins(storeTask.value.time);
    });

    const storeTask = computed(() => {
      return GetTaskById(props.id);
    });

    const storeTaskTimes = computed(() => {
      return GetTaskById(props.id).times;
    });

    function StartTaskWorkTime(params) {
      StartWorkTime({
        taskId: props.id,
        taskTimeId: params.id,
        startTime: params.startTime,
      });
    }
    function StopTaskWorkTime(params) {
      store.dispatch("stopTaskWorkTime", {
        taskId: props.id,
        taskTimeId: params.id,
        stopTime: params.stopTime,
        time: params.time,
      });
    }
    function RemoveWorkTime(param) {
      store.dispatch("removeTaskWorkTime", {
        taskId: props.id,
        taskTimeId: param.id,
      });
    }
    async function SyncTaskName(newName) {
      try {
        ChangeTaskName({
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

    async function RemoveTask() {
      const moreThanOneTask =
        store.state.moduleWorktimeTracker.workday.tasks.length > 1;
      const text = moreThanOneTask ? "delete" : "reset";
      try {
        await ElMessageBox.confirm(
          `Are you sure you want to ${text} Task "${storeTask.value.name}" with ${formattedTime.value} h?`,
          `Confirm ${text} Task`,
          {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
          }
        );
        if (moreThanOneTask) {
          store.dispatch("removeTask", props.id);
        } else {
          store.dispatch("resetTask", props.id);
        }
        ElMessage({
          type: "success",
          message: `${text} completed`,
        });
      } catch {
        ElMessage({
          type: "info",
          message: `${text} canceled`,
        });
      }
    }

    return {
      //computed
      formattedTime,
      storeTask,
      storeTaskTimes,
      //functions
      StartTaskWorkTime,
      StopTaskWorkTime,
      RemoveWorkTime,
      SyncTaskName,
      Debounce,
      RemoveTask,
    };
  },
};
</script>

<style lang="scss" scoped>
.task {
  margin-bottom: 14px;
}
.task__title {
  width: 100px;
  margin-right: 14px;
}
.task__delete {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-right: 14px;
}
</style>
