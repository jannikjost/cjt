<template>
  <div class="overview">
    <el-card><History /></el-card>
    <el-card><OvertimeByMonths /></el-card>
    <el-card class="chart"><Chart /></el-card>
  </div>
</template>

<script setup>
import History from "../components/Overview/History.vue";
import OvertimeByMonths from "../components/Overview/OvertimeByMonths.vue";
import Chart from "../components/Overview/Chart.vue";
import { onMounted } from "vue";
import { useOvertimeStore } from "../store/OvertimeStore";

onMounted(() => {
  const overtimeStore = useOvertimeStore();
  overtimeStore.hydrate();
});
</script>

<style lang="scss" scoped>
.overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 50px;

  margin: 24px;
}

@media only screen and (max-width: 576px) {
  .overview {
    grid-template-columns: 1fr;
  }
}

@media only screen and (min-width: 576px) {
  .chart {
    grid-column: 1/3;
  }
}
</style>
