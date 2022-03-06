<!--
 * @Description: 
 * @Author: zhouy
 * @Date: 2021-07-22 16:43:17
 * @LastEditTime: 2021-12-21 10:38:53
 * @LastEditors: zhouy
-->
<template>
  <div id="app">
    <Menu />
    <router-view></router-view>
  </div>
</template>

<script>
import Menu from "@/components/menu/index.vue";
export default {
  components: {
    Menu,
  },
  name: "App",
};
</script>

<style>
@import url("./assets/style.css");
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: grid;
  grid-template-columns: 240px 1fr;
  width: 100vw;
  height: 100vh;
}
</style>
