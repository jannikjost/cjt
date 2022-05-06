<script setup>
import { ref, computed } from "vue";
import Task from "./Task.vue";
import Dialog from "./Dialog.vue";
import { convertMinsToHrsMins } from "../../services/formatter";
import { ElMessageBox } from "element-plus";
import Card from "../Card.vue";
import { storeToRefs } from "pinia";
import { useWorkdayStore } from "../../store/WorkdayStore.js";
import { useCommandStore } from "../../store/CommandStore.js";

const workdayStore = useWorkdayStore();
const commandStore = useCommandStore();
const showDialog = ref(false);
const { tasks, percentage, isFinished, time } = storeToRefs(workdayStore);

(() => {
  commandStore.register({
    title: "Feierabend",
    description: "Feierabend!!!",
    command: finishWorkday,
  });
})();

//TODO why not convert in store?
const convertedWorkTime = computed(() => {
  return convertMinsToHrsMins(time);
});

const customColorMethod = (percentage) => {
  if (isFinished.value && percentage < 100) {
    return "#fc0a0a";
  }
  if (isFinished.value && percentage >= 100) {
    return "#67c23a";
  }

  return "#F39221";
};

function finishWorkday() {
  workdayStore.calculateWorkTime();

  //TODO enable for 1.0
  // showDialog.value = true;
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
  try {
    workdayStore.dehydrate();
  } catch {}
}
</script>

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
          <el-button @click="workdayStore.addTask">Add new Task</el-button>
          <el-button class="feierabend" type="primary" @click="finishWorkday"
            >Feierabend</el-button
          >
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
</style>
