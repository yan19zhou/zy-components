<!--
 * @Author: xjt
 * @Date: 2021-06-26 11:16:01
 * @LastEditTime: 2021-08-12 18:30:53
 * @Description: 心理评估
 * @LastEditors: zhouy
-->
<template>
  <div>
    <Adialog ref="adialog" />
  </div>
</template>

<script>
import Adialog from "@/views/yq-personnel/medicalMonitor/assess/assess.vue";
import { mixinsId } from "../mixin/mixinId";

export default {
  name: "mentalHealth",
  mixins: [mixinsId],
  inject: ["personId", "row"],
  components: {
    Adialog,
  },
  mounted() {
     this.queryData();
  },
  methods: {
    queryData() {
      this.$refs.adialog.show('preview',this.row());
    },
  },
};
</script>

<style lang="scss" scoped></style>
