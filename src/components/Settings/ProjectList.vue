<template>
  <ul>
    <li v-for="project in projects" :key="project.name" class="project">
      <input :value="project.name" />
      <button
        @click="inactiveHandle(project)"
        :class="{ inactive: !project.isActive }"
      >
        {{ project.isActive ? "active" : "inactive" }}
      </button>
      <button @click="deleteProjectHandle(project)">x</button>
    </li>
  </ul>
  <button @click="addProjectHandle">+</button>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const projects = ref([
      { name: "a", isActive: true },
      { name: "b", isActive: true },
    ]);

    function inactiveHandle(project) {
      project.isActive = !project.isActive;
    }

    function deleteProjectHandle(project) {
      projects.value.splice(
        projects.value.findIndex((p) => p.name === project.name),
        1
      );
    }

    function addProjectHandle() {
      projects.value.push({ name: "", isActive: true });
    }

    return {
      projects,
      inactiveHandle,
      deleteProjectHandle,
      addProjectHandle,
    };
  },
};
</script>

<style scoped>
ul {
  list-style: none;
}

input {
  padding: 0.5em;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
button {
  padding: 0.5em;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
button:hover {
  cursor: pointer;
}
.project {
  margin: 4px;
}
.project > * {
  margin: 4px;
}
.inactive {
  background-color: red;
  color: #fff;
}
</style>
