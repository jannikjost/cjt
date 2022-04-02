<template>
  <Card>
    <form @submit.prevent="submitForm">
      <div class="form-control" :class="{ invalid: !weeklyHours.isValid }">
        <label for="weeklyHours">weekly hours:</label>
        <input
          type="text"
          name="weeklyHours"
          v-model="weeklyHours.value"
          @change="submitForm"
          @input="clearInput('weeklyHours')"
        />
        <p v-if="!weeklyHours.isValid">You must provide your weekly Hours</p>
      </div>
      <div class="form-control">
        <label>Project List:</label>
        <ProjectList />
      </div>
    </form>
  </Card>
</template>

<script>
import { ref } from "vue";
import Card from "../components/Card.vue";
import ProjectList from "../components/Settings/ProjectList.vue";

export default {
  components: { Card, ProjectList },
  setup() {
    const formIsValid = ref(true);
    const weeklyHours = ref({ value: "", isValid: true });
    const projectList = ref({ value: "", isValid: true });

    function validateForm() {
      formIsValid.value = true;
      if (
        !weeklyHours.value.value ||
        weeklyHours.value.value < 0 ||
        weeklyHours.value.value > 10
      ) {
        weeklyHours.value.isValid = false;
        formIsValid.value = false;
      }
    }

    function submitForm() {
      validateForm();
      if (!formIsValid.value) return;
    }

    function clearInput(input) {
      this[input].isValid = true;
    }

    return {
      weeklyHours,
      projectList,

      submitForm,
      clearInput,
    };
  },
};
</script>

<style lang="scss" scoped>
.invalid label {
  color: red;
}
.invalid input,
.invalid textarea {
  border: 1px solid red;
}
</style>
