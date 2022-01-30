<template>
  <div class="app">
    <!-- navigation -->
    <nav class="nav">
      <div class="nav__element">logo</div>
      <router-link class="nav__element link" to="/">Home</router-link>
      <router-link class="nav__element link" to="/overview"
        >Overview</router-link
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
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  setup() {
    const versionString = "cjt Version 0.1.0";

    return {
      versionString,
    };
  },
};
</script>

<style>
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
  color: #2c3e50;
  height: 100%;
}
.app {
  /* height: calc(100% - 93px); */
  height: 100%;
  display: flex;
  flex-direction: column;
}
.nav {
  display: flex;
  height: 75px;
  background-color: #a63c86;
  color: #fff;
  align-items: center;
}
.nav__element {
  margin: 0 14px;
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
  border-top: 4px solid #a63c86;
  border-bottom: 4px solid #a63c86;

  height: 100%;
  width: 100px;
}
.link:hover {
  border-bottom: 4px solid #943578;
  border-top: 4px solid #fff;
  background-color: #943578;
}
.link:visited {
  color: inherit;
}

.content {
  flex-grow: 1;
}

.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;

  color: #a63c86;
  font-size: 12px;
  cursor: default;
}
.footer__version {
  filter: brightness(75%);
}
.github_logo {
  height: 18px;
}
</style>
