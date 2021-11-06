<template>
  <div class="history">
    <div class="table">
      <el-table
        :data="storeOvertimeData"
        style="width: 100%"
        height="400px"
        :show-header="false"
      >
        <el-table-column prop="date">
          <template #default="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{
              formatDateDayMonthYear(scope.row.date)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overtime">
          <template #default="scope">
            <span>{{ formatOvertime(scope.row.overtime) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="picker">
      <el-date-picker v-model="date" type="date" :shortcuts="shortcuts" />
      <el-input-number
        v-model="overtime"
        controls-position="right"
        :step="15"
        :max="120"
        :min="-480"
        step-strictly
        @change="overtimeInputChanged"
      />
      <el-button @click="addOvertime" type="primary">+</el-button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import {
  formatOvertime,
  formatDateDayMonthYear,
} from "./../../services/formatter";
import { useStore } from "vuex";
import { ElMessageBox, ElMessage } from "element-plus";

export default {
  setup() {
    const store = useStore();
    const date = ref(new Date());
    const overtime = ref(0);
    const shortcuts = [
      {
        text: "Today",
        value: new Date(),
      },
      {
        text: "Yesterday",
        value: () => {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24);
          return date;
        },
      },
    ];

    onMounted(async () => {
      //TODO add load state
      store.dispatch("loadData");
    });

    const storeOvertimeData = computed(() => {
      return store.state.moduleOvertime.overtime;
    });

    async function addOvertime() {
      //TODO sometimes date does not work, select dec.1
      //TODO selecting passed date does not work
      //TODO selecting current date also saves time
      if (date.value && overtime.value) {
        // check if entry for given date already exists
        if (
          store.state.moduleOvertime.overtime.filter((el) => {
            return el.date.getTime() === date.value.getTime();
          }).length
        ) {
          //TODO get old overtime
          try {
            await ElMessageBox.confirm(
              `Replace old value: ${overtime.value} with new value: ${overtime.value}?`,
              `Entry for ${date.value.toLocaleDateString()} already exists`,
              {
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
              }
            );
            //TODO overwrite entry
            ElMessage({
              type: "success",
              message: "Overwrite completed",
            });
          } catch {
            ElMessage({
              type: "info",
              message: "Overwrite canceled",
            });
          }
          return;
        }
        addEntry();
      }
    }

    //TODO sort after adding value in cause older date gets entered, prob in store
    async function addEntry() {
      const newOvertime = store.state.moduleOvertime.overtime.length
        ? store.state.moduleOvertime.overtime[0].overtime + overtime.value
        : overtime.value;
      const overtimeObject = {
        date: date.value,
        overtime: newOvertime,
      };
      try {
        await store.commit("addOvertime", overtimeObject);
        ElMessage({
          type: "success",
          message: "Add Overtime completed",
        });
      } catch {
        ElMessage({
          type: "error",
          message: "Add Overtime failed",
        });
      }
    }

    //allow user to input hours
    //TODO input does not always refresh, cause technically value doesnt change
    function overtimeInputChanged(value) {
      if (!value) return;
      const separator = ".";
      if (value.toString().includes(separator)) {
        const valueString = value.toString();
        const hours = valueString.substring(0, valueString.indexOf(separator));
        const minutes = valueString.substring(
          valueString.indexOf(separator) + 1,
          valueString.length
        );

        const newValue = hours * 60 + Number(minutes === "3" ? 30 : minutes);
        overtime.value = hours <= 2 && hours >= -8 ? newValue : 0;
      }
      //check if value ist between 2 and -8
      else if (value % 15 !== 0 && value <= 2 && value >= -8) {
        overtime.value = value * 60;
      }
      //invalid value
      else if (value % 15 !== 0) {
        overtime.value = 0;
      }
    }

    return {
      //data
      date,
      overtime,
      shortcuts,

      //computed
      storeOvertimeData,

      //functions
      addOvertime,
      overtimeInputChanged,
      formatDateDayMonthYear,
      formatOvertime,
    };
  },
};
</script>

<style lang="scss" scoped>
.history {
  display: flex;
  flex-direction: column;
}
.table {
  flex-grow: 1;
  margin-bottom: 12px;
}
.picker {
  display: flex;
  justify-content: center;
}

.el-input {
  width: 10%;
}
</style>
