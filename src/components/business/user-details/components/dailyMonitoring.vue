<!--
 * @Description: 日常监测
 * @Author: zhouy
 * @Date: 2021-07-30 09:53:04
 * @LastEditTime: 2021-07-31 12:08:24
 * @LastEditors: zhouy
-->

<template>
  <div class="basic-from abow_dialog">
    <DailyMonitoring ref="dailyInspection" :personData="personData"  pageForm="preview"/>
  </div>
</template>

<script>
import DailyMonitoring from "@/views/yq-personnel/components/medical/dailyMonitoring.vue";
export default {
  name: "dailyMonitoring",
    provide() {
    return {
      //初始化数据
      playback: ()=>{},
    };
  },
  inject: [ "row"],
  components: {
    DailyMonitoring,
  },
  computed: {
    personData() {
      return this.row(); 
    }
  },
};
</script>

<style lang="scss" scoped></style>
