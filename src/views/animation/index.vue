<!--
 * @Description: 首页
 * @Author:  zhouy
 * @Date: 2021-07-22 17:02:14
 * @LastEditTime: 2021-12-21 14:59:33
 * @LastEditors: zhouy
-->
<template>
  <div class="main">
    <div class="item">
      <div>行星</div>
      <StarAround />
    </div>
    <div class="item">
      <div>按钮</div>
      <Btn />
    </div>
  </div>
</template>

<script>
import StarAround from "@/components/star-around/index.vue";
import Btn from "./components/button.vue";
export default {
  components: {
    StarAround,
    Btn,
  },
};
</script>

<style lang="scss" scoped>
.main {
  width: 92%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  grid-auto-rows: 300px;
  .item {
    border: 1px solid #007aff33;
  }
}
</style>
