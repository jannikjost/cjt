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
import { useOvertimeStore } from "./OvertimeStore";

vi.mock("../api/db.js", () => ({
  getData() {
    return new Promise((resolve) => {
      resolve([{ date: new Date(1), overtime: 30 }]);
    });
  },
  addEntry() {
    return new Promise((resolve) => {
      resolve();
    });
  },
}));

beforeAll(() => {
  setActivePinia(createPinia());
});

describe("initializes", () => {
  test("works", () => {
    expect(true).toBe(true);
  });
});

describe("useOvertimeStore", () => {
  let store;

  beforeEach(() => {
    store = useOvertimeStore();
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

    expect(store.overtime).toStrictEqual([{ date: new Date(1), overtime: 30 }]);
  });

  test("adds overtime", async () => {
    await store.addOvertime({ date: new Date(1), overtime: 0 });

    expect(store.overtime.length).toStrictEqual(1);
  });

  test("sort the added overtime", async () => {
    const overtime1 = { date: new Date(0), overtime: 0 };
    const overtime2 = { date: new Date(1000), overtime: 0 };

    await store.addOvertime(overtime1);
    await store.addOvertime(overtime2);

    expect(store.overtime[0]).toStrictEqual(overtime2);
  });
});
