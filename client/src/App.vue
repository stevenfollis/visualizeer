<template>
  <div id="app">
     <router-view></router-view>
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue';

export default {
  name: 'app',
  components: {
    Dashboard,
  },
};
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
#app {
  font-family: "Open Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
