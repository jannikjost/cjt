<script setup>
import History from "../components/Overview/History.vue";
import TaskList from "../components/Home/TaskList.vue";
import Card from "../components/Card.vue";
import { useWorkdayStore } from "../store/WorkdayStore.js";
import { useOvertimeStore } from "../store/OvertimeStore";

const overtimeStore = useOvertimeStore();
overtimeStore.hydrate();
const workdayStore = useWorkdayStore();
workdayStore.hydrate();
</script>

<template>
  <div class="home">
    <TaskList />
    <Card><History /></Card>
  </div>
</template>

<style lang="scss" scoped>
.home {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  grid-gap: 50px;
  margin: 24px;
  flex-grow: 1;
}

@media only screen and (max-width: 576px) {
  .home {
    grid-template-columns: 1fr;
  }
}
</style>
