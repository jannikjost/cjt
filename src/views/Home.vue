<template>
  <div class="home">
    <el-card><WorktimeTracker /></el-card>
    <el-card><History /></el-card>
  </div>
</template>

<script>
import History from "../components/Overview/History.vue";
import WorktimeTracker from "../components/Home/worktimeTracker.vue";

export default {
  name: "Home",
  components: { History, WorktimeTracker },
};
</script>

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
