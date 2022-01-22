<template>
  <el-dialog v-model="show" title="Feierabend" width="30%" :show-close="false">
    <div v-for="task in tasks" :key="task.id">
      <div>{{ task.name }}</div>
      <div>{{ task.time }}</div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="Cancel">Cancel</el-button>
        <el-button type="primary" @click="Confirm">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: { showDialog: Boolean, tasks: Array },
  emits: ["cancel", "confirm"],
  setup(props, { emit }) {
    const show = true;
    function Cancel() {
      emit("cancel");
    }
    function Confirm() {
      emit("confirm");
    }
    return {
      show,
      Cancel,
      Confirm,
    };
  },
};
</script>

<style lang="scss" scoped></style>
