import { getData, addEntry } from "../api/db";

import { reactive, computed } from "vue";

const state = reactive({ overtime: [] });
const getOvertime = computed(() => state.overtime);

async function LoadOvertime() {
  if (state.overtime.length) {
    return;
  }
  const res = await getData();
  res.sort((a, b) => {
    return b.date - a.date;
  });
  state.overtime = res;
}

async function AddOvertime(overtime) {
  await addEntry(overtime);
  state.overtime.unshift(overtime);
  state.overtime.sort((a, b) => {
    return b.date - a.date;
  });
}

export { getOvertime, LoadOvertime, AddOvertime };
