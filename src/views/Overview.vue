<template>
  <div class="overview">
    <el-card>history</el-card>
    <el-card>last 12 months</el-card>
    <el-card class="chart">chart</el-card>
  </div>
</template>

<script>
export default {};
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