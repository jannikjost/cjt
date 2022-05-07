<script setup>
import { ref } from "vue";
import { ElMessageBox } from "element-plus";
import { useOvertimeStore } from "../../store/OvertimeStore";
import {
  formatOvertime,
  formatDateDayMonthYear,
} from "./../../services/formatter";
import {
  errorNotification,
  infoNotification,
  successNotification,
} from "../../services/notificationService";

const overtimeStore = useOvertimeStore();
const date = ref(new Date());
const minutes = ref(0);
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

async function addOvertimeClick() {
  //TODO selecting current date also saves time
  //TODO validation would be nice
  if (!date.value || !minutes.value) return;
  if (overtimeStore.overtimeExists(date.value)) {
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
      successNotification("Overwrite completed");
    } catch {
      infoNotification("Overwrite canceled");
    }
    return;
  }
  addEntry();
}

async function addEntry() {
  const overtimeObject = {
    date: date.value,
    minutes: minutes.value,
  };
  try {
    await overtimeStore.addOvertime(overtimeObject);
    successNotification("Adding Overtime completed");
  } catch (err) {
    errorNotification("Adding Overtime failed");
    console.error(err);
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
</script>

<template>
  <div class="history">
    <div class="table">
      <!-- //TODO add heigth option for Home -->
      <el-table
        :data="overtimeStore.overtimes"
        style="width: 100%"
        height="400px"
      >
        <el-table-column prop="date" label="Date">
          <template #default="scope">
            <span>{{ formatDateDayMonthYear(scope.row.date) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="minutes" label="Minutes">
          <template #default="scope">
            <span :class="{ negative: scope.row.minutes < 0 }">{{
              formatOvertime(scope.row.minutes)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overtime" label="Overtime">
          <template #default="scope">
            <span :class="{ negative: scope.row.overtime < 0 }">{{
              formatOvertime(scope.row.overtime)
            }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="picker">
      <el-date-picker v-model="date" type="date" :shortcuts="shortcuts" />
      <el-input-number
        v-model="minutes"
        controls-position="right"
        :step="15"
        :max="120"
        :min="-480"
        step-strictly
        @change="overtimeInputChanged"
      />
      <el-button @click="addOvertimeClick" type="primary">+</el-button>
    </div>
  </div>
</template>

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

.negative {
  color: red;
}
</style>
