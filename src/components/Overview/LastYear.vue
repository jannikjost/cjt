<template>
  <div class="lastYear">
    <p>{{ year }}</p>
    <el-table :data="tableData" style="width: 100%" :show-header="false">
      <el-table-column prop="date">
        <template #default="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{
            formatDate(scope.row.date)
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
</template>

<script>
import { ref, onMounted } from "vue";
import { getData } from "./../../api/db";
export default {
  setup() {
    const tableData = ref([]);
    const year = ref();

    onMounted(async () => {
      tableData.value = await getData();
      year.value =
        formatDate(tableData.value[0].date) +
        " - " +
        formatDate(tableData.value[tableData.value.length - 1].date);
    });

    function formatDate(date) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const year = date.getFullYear();
      const month = monthNames[date.getMonth()];
      return month + " " + year;
    }

    function formatOvertime(time) {
      if (!time) return;
      const seperator = ":";
      const i = time.toString().indexOf(",");
      // Not an odd value
      if (i < 0) {
        return time + seperator + "00";
      }
      const hours = time.substring(0, i);
      const minutes = time.substring(i + 1, time.length);
      var formattedMinutes;
      switch (minutes) {
        case "25":
          formattedMinutes = "15";
          break;
        case "5":
          formattedMinutes = "30";
          break;
        case "75":
          formattedMinutes = "45";
          break;
        default:
          break;
      }
      return hours + seperator + formattedMinutes;
    }

    return {
      tableData,
      year,

      formatDate,
      formatOvertime,
    };
  },
};
</script>

<style lang="scss" scoped></style>
