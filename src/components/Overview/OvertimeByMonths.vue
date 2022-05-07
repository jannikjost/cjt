<template>
  <div class="lastYear">
    <p>{{ year }}</p>
    <el-table :data="storeOvertimeData" style="width: 100%" height="400px">
      <el-table-column prop="date" label="Month">
        <template #default="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{
            formatDateMonthYear(scope.row.date)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="overtimeThisMonth" label="Overtime this Month">
        <template #default="scope">
          <span>{{ formatOvertime(scope.row.overtimeThisMonth) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="overtime" label="Overtime">
        <template #default="scope">
          <span>{{ formatOvertime(scope.row.overtime) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { computed } from "vue";
import {
  formatOvertime,
  formatDateMonthYear,
} from "./../../services/formatter";
import { useOvertimeStore } from "../../store/OvertimeStore";

const overtimeStore = useOvertimeStore();

const storeOvertimeData = computed(() => {
  return formatOvertimeDate([...overtimeStore.overtimes]);
});

const year = computed(() => {
  if (overtimeStore.overtimes.length) {
    //? what happens if only one month is in db
    return (
      formatDateMonthYear(
        overtimeStore.overtimes[overtimeStore.overtimes.length - 1].date
      ) +
      " - " +
      formatDateMonthYear(overtimeStore.overtimes[0].date)
    );
  }
  return "";
});

function formatOvertimeDate(data) {
  data.sort((a, b) => {
    return a.date - b.date;
  });
  const monthlyOverview = [];
  let index = -1;
  let currMonth = -1;
  data.forEach((el) => {
    const month = el.date.getMonth();
    if (currMonth !== month) {
      index++;
    }

    if (!monthlyOverview[index]) {
      currMonth = month;
      monthlyOverview[index] = {
        date: el.date,
        overtime: el.overtime,
        overtimeThisMonth: el.overtime,
      };
      //calculate the overtime made the previous month
      const lastMonth = monthlyOverview[index - 1];
      if (lastMonth) {
        monthlyOverview[index].overtime += lastMonth.overtime;
      }
    } else {
      monthlyOverview[index].overtime += el.overtime;
      monthlyOverview[index].overtimeThisMonth += el.overtime;
    }
  });
  return monthlyOverview.reverse();
}
</script>

<style lang="scss" scoped></style>
