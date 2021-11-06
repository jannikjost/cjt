<template>
  <div class="lastYear">
    <p>{{ year }}</p>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="Month">
        <template #default="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{
            formatDateMonthYear(scope.row.date)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="overtime" label="Overtime">
        <template #default="scope">
          <span>{{ formatOvertime(scope.row.overtime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="overtimeThisMonth" label="Overtime this Month">
        <template #default="scope">
          <span>{{ formatOvertime(scope.row.overtimeThisMonth) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getData } from "./../../api/db";
import {
  formatOvertime,
  formatDateMonthYear,
} from "./../../services/formatter";

export default {
  setup() {
    const tableData = ref([]);
    const year = ref();

    onMounted(async () => {
      let data = await getData();
      data.sort((a, b) => {
        return b.date - a.date;
      });
      const monthlyOverview = [];
      let index = -1;
      let currMonth = 0;
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
      tableData.value = monthlyOverview;
      //? what happens if only one month is in db
      year.value =
        formatDateMonthYear(tableData.value[tableData.value.length - 1].date) +
        " - " +
        formatDateMonthYear(tableData.value[0].date);
    });

    return {
      tableData,
      year,

      formatOvertime,
      formatDateMonthYear,
    };
  },
};
</script>

<style lang="scss" scoped></style>
