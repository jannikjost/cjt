<script setup>
import { ref } from "vue";
import CommandPalette from "./components/CommandPalette.vue";
import { useMagicKeys, whenever } from "@vueuse/core";

const versionString = "cjt Version 0.1.0";
const displayCommandPalette = ref(false);
const keys = useMagicKeys();

whenever(keys.Escape, () => {
  if (displayCommandPalette.value) {
    displayCommandPalette.value = false;
  }
});

whenever(keys.alt_k, () => {
  displayCommandPalette.value = !displayCommandPalette.value;
});
</script>

<template>
  <div class="app">
    <!-- navigation -->
    <nav class="nav">
      <div class="nav__element">logo</div>
      <router-link class="nav__element link" to="/">Home</router-link>
      <router-link class="nav__element link" to="/overview"
        >Overview</router-link
      >
      <router-link class="nav__element link" to="/settings"
        >Settings</router-link
      >
    </nav>
    <main class="content">
      <router-view></router-view>
    </main>
    <footer class="footer">
      <div class="footer__version">{{ versionString }}</div>
      <a href="https://github.com/jannikjost/cjt/releases" target="_blank"
        ><img class="github_logo" src="./assets/GitHub-Mark-32px.png"
      /></a>
    </footer>
    <CommandPalette
      v-show="displayCommandPalette"
      :displayed="displayCommandPalette"
    />
  </div>
</template>

<style lang="scss">
@import "./styles/element-variables.scss";

html,
body {
  margin: 0;
  box-sizing: border-box;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #141414;
  height: 100%;
}
.app {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.nav {
  display: flex;
  align-items: center;
  gap: 14px;

  min-height: 50px;
  background-color: $--color-primary;
  color: #fff;
}
.nav__element {
  color: #fff;
  font-weight: 700;
}

.link {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 200ms ease-in-out;
  border-top: 4px solid $--color-primary;
  border-bottom: 4px solid $--color-primary;

  height: 100%;
  width: 100px;
}
.link:hover {
  border-top: 4px solid $--color-primary-dark;
  border-bottom: 4px solid #fff;
  background-color: $--color-primary-dark;
}
.link:visited {
  color: inherit;
}
.router-link-exact-active {
  border-bottom: 4px solid $--color-secondary;
  background-color: $--color-primary-dark;
  border-top: 4px solid $--color-primary-dark;
}

.content {
  flex-grow: 1;
}

.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;

  color: $--color-secondary;
  font-size: 12px;
  cursor: default;
}
.github_logo {
  height: 18px;
}
</style>
