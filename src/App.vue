<template>
  <div class="app">
    <!-- navigation -->
    <div class="nav">
      <div class="nav__element">logo</div>
      <router-link class="nav__element link" to="/">Home</router-link>
      <router-link class="nav__element link" to="/overview"
        >Overview</router-link
      >
    </div>
    <!-- router links -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
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
}

.link {
  text-decoration: none;
  transition: transform 0.2s; /* Animation */
}
.link:hover {
  transform: scale(1.5);
  border-bottom: 1px solid #fff;
}
.link:visited {
  color: inherit;
}
</style>
