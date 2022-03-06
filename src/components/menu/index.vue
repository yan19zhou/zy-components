<!--
 * @Description: 
 * @Author: zhouy
 * @Date: 2021-07-28 17:17:40
 * @LastEditTime: 2021-07-28 17:40:19
 * @LastEditors: zhouy
-->
<template>
  <el-menu
    default-active="1"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-menu-item :index="item.path" v-for="item in menus" :key="item.name" @click="handler(item)">
      <i class="el-icon-menu"></i>
      {{item.path}}
      <span slot="title">{{item.meta.title}}</span>
    </el-menu-item>
  </el-menu>
</template>
<script>
export default {
  computed: {
    menus() {
      return this.$router.options.routes;
    },
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handler(item){
        this.$router.push(item.path)
    }
  },
};
</script>

<style lang="scss" scoped>
.el-menu-item{
    text-align: left;
}
</style>
