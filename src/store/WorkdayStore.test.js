import { setActivePinia, createPinia } from "pinia";
import {
  describe,
  test,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { useWorkdayStore } from "./WorkdayStore";

vi.mock("../api/db.js", () => ({
  getWorkday() {
    return new Promise((resolve) => {
      resolve({
        id: 0,
        workday: JSON.stringify({
          date: "",
          time: 0,
          isFinished: true,
          percentage: 0,
          tasks: [],
        }),
      });
    });
  },
  updateWorkday() {
    return new Promise((resolve) => {
      resolve();
    });
  },
}));

vi.mock("uuid", () => ({
  v4() {
    return 1;
  },
}));

const testWorkday = {
  date: "",
  time: 0,
  isFinished: true,
  percentage: 0,
  tasks: [{ id: 1, name: "", times: [{ id: 1 }], time: 0 }],
};

beforeAll(() => {
  setActivePinia(createPinia());
});

describe("initializes", () => {
  test("works", () => {
    expect(true).toBe(true);
  });
});

describe("useWorkdayStore", () => {
  let store;

  beforeEach(() => {
    store = useWorkdayStore();
  });

  afterEach(() => {
    store.$reset();
    vi.restoreAllMocks();
  });

  test("references a store", () => {
    expect(store).toBeDefined();
  });

  test("hydrates the store", async () => {
    await store.hydrate();

    expect(store.$state).toEqual({
      date: "",
      time: 0,
      isFinished: true,
      percentage: 0,
      tasks: [{ id: 1, name: "", times: [{ id: 1 }], time: 0 }],
    });
  });

  test("dehydrates the store", async () => {
    await store.dehydrate();

    expect(store.$state).toEqual({
      date: "",
      time: 0,
      isFinished: true,
      percentage: 0,
      tasks: [],
    });
  });

  test("setWorkday", () => {
    store.setWorkday(testWorkday);

    expect(store.$state).toEqual(testWorkday);
  });

  test("addTask", () => {
    store.addTask();

    expect(store.$state.tasks.length).toEqual(1);
  });

  test("renameTask", () => {
    const nameToTest = "newName";
    addTasks(1)
    store.renameTask(store.$state.tasks[0].id, nameToTest);

    expect(store.$state.tasks[0].name).toEqual(nameToTest);
  });

  test("resetTask", () => {
    addTasks(1);
    const addedTask = store.$state.tasks[0];
    store.$state.tasks[0].name = "test";
    store.resetTask(addedTask.id);

    expect(store.$state.tasks[0]).toEqual(addedTask);
  });

  test("removeTask", () => {
    addTasks(2);
    store.removeTask(store.$state.tasks[0].id);

    expect(store.$state.tasks.length).toEqual(1);
  });

  test("calculateTaskTime", () => {
    addTasks(1);
    store.$state.tasks[0].times = [{ time: 15 }, { time: 30 }];
    store.calculateTaskTime(store.$state.tasks[0].id);

    expect(store.$state.tasks[0].time).toEqual(45);
  });

  test("calculateWorkTime", () => {
    addTasks(2);
    store.$state.tasks[0].time = 45;
    store.$state.tasks[1].time = 15;
    store.calculateWorkTime();

    expect(store.$state.time).toEqual(60);
  });

  function addTasks(number) {
    store.$state.tasks = [];
    for (let i = 1; i <= number; i++) {
      store.$state.tasks.push({ id: i, name: i, time: 0, times: [{ id: i }] });
    }
  }
});
