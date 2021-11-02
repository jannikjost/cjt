<template>
  <div class="history">
    <div class="table">
      <el-table :data="tableData" style="width: 100%" :show-header="false">
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
import { ref, onMounted } from "vue";
import { addEntry, getData } from "./../../api/db";
import {
  formatOvertime,
  formatDateDayMonthYear,
} from "./../../services/formatter";

export default {
  setup() {
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
    const tableData = ref([]);

    onMounted(async () => {
      let data = await getData();
      data.sort((a, b) => {
        return b.date - a.date;
      });
      tableData.value = data;
    });

    function addOvertime() {
      //TODO refresh data
      //TODO sometimes date does not work, select dec.1
      //TODO selecting passed date does not work
      if (date.value && overtime.value) {
        if (
          tableData.value.filter((el) => {
            return el.date.getDate() === date.value.getDate();
          }).length
        ) {
          //TODO replace old value for that date or dont allow it?
          return;
        }
        const newOvertime = tableData.value.length
          ? tableData.value[0].overtime + overtime.value
          : overtime.value;
        const overtimeObject = {
          date: date.value,
          overtime: newOvertime,
        };
        addEntry(overtimeObject);
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
      tableData,

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
