import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ProjectList from "./ProjectList.vue";

describe("ProjectList component", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(ProjectList, {});
  });

  test("component mounts", () => {
    expect(wrapper).toBeTruthy();
  });

  test("add project", async () => {
    const button = wrapper.find(".addProject");
    await button.trigger("click");
    expect(wrapper.vm.projects.length).toBe(3)
  });
});
