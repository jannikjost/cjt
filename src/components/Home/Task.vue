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
        <el-button type="danger" size="small" @click="RemoveTaskClick"
          >x</el-button
        >
      </div>
    </template>
    <div>
      <Time
        v-for="time in storeTaskTimes"
        :key="time.id"
        v-on:removeworktime="HandleRemoveWorkTime"
        v-on:addworktime="HandleAddWorkTime"
        :taskId="id"
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
import { ElMessageBox } from "element-plus";
import { convertMinsToHrsMins } from "./../../services/formatter";
import { useWorkdayStore } from "../../store/WorkdayStore.js";
import {
  errorNotification,
  infoNotification,
  successNotification,
} from "../../services/notificationService";

export default {
  components: { Time },
  props: { id: String },
  setup(props) {
    const store = useWorkdayStore();
    const formattedTime = computed(() => {
      return convertMinsToHrsMins(storeTask.value.time);
    });

    const storeTask = computed(() => {
      return store.getTaskById(props.id);
    });

    const storeTaskTimes = computed(() => {
      return store.getTaskById(props.id).times;
    });

    function HandleRemoveWorkTime(param) {
      store.removeTime({
        taskId: props.id,
        taskTimeId: param.id,
      });
    }
    function HandleAddWorkTime() {
      store.addTime(storeTask.value.id);
    }
    async function SyncTaskName(newName) {
      try {
        store.removeTask(storeTask.value.id, newName);
      } catch {
        errorNotification(
          `Rename of Task "${storeTask.value.name}" was not successful`
        );
      }
    }

    async function RemoveTaskClick() {
      const moreThanOneTask = store.hastMoreThanOneTask;
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
          store.removeTask(props.id);
        } else {
          store.resetTask(props.id);
        }
        successNotification(`${text} completed`);
      } catch {
        infoNotification(`${text} canceled`);
      }
    }

    return {
      //computed
      formattedTime,
      storeTask,
      storeTaskTimes,
      //functions
      HandleRemoveWorkTime,
      HandleAddWorkTime,
      SyncTaskName,
      Debounce,
      RemoveTaskClick,
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
