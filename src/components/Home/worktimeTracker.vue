<template>
  <div>
    <el-collapse class="tasks">
      <Task v-for="task in storeTasks" :key="task.id" :id="task.id" />
    </el-collapse>
    <el-button @click="addNewTask">Add new Task</el-button>
    <div class="summary">
      <el-progress
        :stroke-width="20"
        :color="customColorMethod"
        :percentage="percentage"
        :indeterminate="!workdayFinished"
        ><span>{{ workTime }}</span></el-progress
      >
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

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import Task from "./Task.vue";
import { convertMinsToHrsMins } from "./../../services/formatter";

export default {
  components: { Task },
  setup() {
    const store = useStore();
    const isFeierabendAnimation = ref(false);

    onMounted(() => {
      store.dispatch("loadWorkday");
      if (store.state.moduleWorktimeTracker.workday.tasks.length) return;
      addNewTask();
    });

    const workTime = computed(() => {
      return convertMinsToHrsMins(storeWorktime.value);
    });

    const storeTasks = computed(() => {
      return store.state.moduleWorktimeTracker.workday.tasks;
    });
    //TODO its all fucked
    const storeWorktime = computed(() => {
      return store.state.moduleWorktimeTracker.workday.time;
    });

    const percentage = computed(() => {
      return store.state.moduleWorktimeTracker.workday.percentage;
    });

    const workdayFinished = computed(() => {
      return store.state.moduleWorktimeTracker.workday.isFinished;
    });

    const customColorMethod = (percentage) => {
      if (workdayFinished.value && percentage < 100) {
        return "#fc0a0a";
      }
      if (workdayFinished.value && percentage >= 100) {
        return "#67c23a";
      }

      return "#F39221";
    };

    function addNewTask() {
      store.dispatch("addNewTask");
    }

    function feierabend() {
      //TODO show overview of day
      isFeierabendAnimation.value = true;
      store.dispatch("finishWorkDay");

      //wait for animation to finish
      setTimeout(function() {
        isFeierabendAnimation.value = false;
      }, 300);
    }

    return {
      //data
      percentage,
      workdayFinished,
      isFeierabendAnimation,
      //computed
      workTime,
      storeTasks,
      storeWorktime,
      //functions
      customColorMethod,
      addNewTask,
      feierabend,
    };
  },
};
</script>

<style lang="scss" scoped>
.task__title {
  width: 100px;
}
.task {
  display: flex;
  flex-direction: row;
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
