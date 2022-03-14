<template>
  <div class="lastYear">
    <p>{{ year }}</p>
    <el-table :data="storeOvertimeData" style="width: 100%">
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

<script>
import { onMounted, computed } from "vue";
import {
  formatOvertime,
  formatDateMonthYear,
} from "./../../services/formatter";
import { getOvertime, LoadOvertime } from "@/store/modules/Overtime.js";

export default {
  //TODO rename to overtime by months
  setup() {
    onMounted(async () => {
      //? load store in overview
      LoadOvertime();
    });

    const storeOvertimeData = computed(() => {
      return formatOvertimeDate(getOvertime.value);
    });

    const year = computed(() => {
      if (getOvertime.value.length) {
        //? what happens if only one month is in db
        return (
          formatDateMonthYear(
            getOvertime.value[
              getOvertime.value.length - 1
            ].date
          ) +
          " - " +
          formatDateMonthYear(getOvertime.value[0].date)
        );
      }
      return "";
    });

    function formatOvertimeDate(data) {
      data.sort((a, b) => {
        return b.date - a.date;
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
            lastMonth.overtimeThisMonth -= el.overtime;
          }
        }
      });
      return monthlyOverview;
    }

    return {
      //data
      year,

      //computed
      storeOvertimeData,

      //functions
      formatOvertime,
      formatDateMonthYear,
    };
  },
};
</script>

<style lang="scss" scoped></style>
