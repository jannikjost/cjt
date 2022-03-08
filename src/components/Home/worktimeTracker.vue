<template>
  <Card class="tracker">
    <el-collapse class="tasks">
      <Task v-for="task in tasks" :key="task.id" :id="task.id" />
    </el-collapse>
    <template v-slot:footer>
      <div class="summary">
        <el-progress
          class="progress"
          :stroke-width="20"
          :color="customColorMethod"
          :percentage="percentage"
          :indeterminate="!isFinished"
          ><span>{{ convertedWorkTime }}</span></el-progress
        >

        <div class="btn-group">
          <el-button type="danger" @click="resetAll">Reset all</el-button>
          <el-button @click="addNewTask">Add new Task</el-button>
          <el-button class="feierabend" type="primary" @click="feierabend"
            ><div class="feierabend__container">
              <div>Feierabend</div>
              <img
                class="beer"
                :class="{ beerAnimation: isFeierabendAnimation }"
                src="../../assets/beer.svg"
              /></div
          ></el-button>
        </div>
      </div>
    </template>
    <Dialog
      v-if="showDialog"
      :tasks="tasks"
      v-on:cancel="cancelDialog"
      v-on:confirm="confirmDialog"
    />
  </Card>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import Task from "./Task.vue";
import Dialog from "./Dialog.vue";
import { convertMinsToHrsMins } from "../../services/formatter";
import { ElMessageBox } from "element-plus";
import Card from "../Card.vue";
import {
  hasTasks,
  LoadWorkday,
  tasks,
  worktime,
  percentage,
  isFinished,
} from "@/store/modules/WorktimeTracker.js";

export default {
  components: { Task, Dialog, Card },
  setup() {
    const isFeierabendAnimation = ref(false);
    const showDialog = ref(false);

    onMounted(async () => {
      try {
        await LoadWorkday();
      } catch {
        //TODO error message "reading old workday went wrong"
      }
      if (hasTasks) return;
      addNewTask();
    });

    //TODO why not convert in store?
    const convertedWorkTime = computed(() => {
      return convertMinsToHrsMins(worktime);
    });

    const customColorMethod = (percentage) => {
      if (isFinished && percentage < 100) {
        return "#fc0a0a";
      }
      if (isFinished && percentage >= 100) {
        return "#67c23a";
      }

      return "#F39221";
    };

    function addNewTask() {
      store.dispatch("addNewTask");
    }

    function feierabend() {
      isFeierabendAnimation.value = true;
      store.dispatch("finishWorkDay");

      //wait for animation to finish
      setTimeout(function () {
        isFeierabendAnimation.value = false;
      }, 300);
      showDialog.value = true;
    }

    function cancelDialog() {
      showDialog.value = false;
    }

    function confirmDialog() {
      showDialog.value = false;
      //TODO auto add overtime
    }

    async function resetAll() {
      await ElMessageBox.confirm(
        `Are you sure you want to reset all tasks?`,
        `Confirm Reset`,
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
        }
      );
      store.dispatch("resetAll");
    }

    return {
      //data
      isFeierabendAnimation,
      showDialog,
      //computed
      tasks,
      convertedWorkTime,
      percentage,
      isFinished,
      //functions
      customColorMethod,
      addNewTask,
      feierabend,
      cancelDialog,
      confirmDialog,
      resetAll,
    };
  },
};
</script>

<style lang="scss" scoped>
.tracker {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.tasks {
  margin-bottom: 14px;
  flex-grow: 1;
}
.progress {
  margin-bottom: 14px;
}

.btn-group {
  display: flex;
  justify-content: flex-end;
}
.feierabend__container {
  display: flex;
  align-items: center;
}
.beer {
  margin-left: 8px;
  width: 20px;
}
.beerAnimation {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}
//TODO better animation
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
