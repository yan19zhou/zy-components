<!--
 * @Description: 前违逃
 * @Author: zhouy
 * @Date: 2021-07-30 10:33:15
 * @LastEditTime: 2021-07-30 12:07:45
 * @LastEditors: zhouy
-->
<template>
  <div>
    <Adialog ref="adialog" />
  </div>
</template>

<script>
import Adialog from "@/views/yq-personnel/exConvict/dialog.vue";
import { mixinsId } from "../mixin/mixinId";
export default {
  name: "exConvict",
  mixins: [mixinsId],
  inject: ["personId", "row"],
  components: { Adialog },
  mounted () {
     this.queryData();
  },
  methods: {
    queryData() {
      this.$refs.adialog.changeVisible({ preview: "preview", row: this.row() });
    },
  },
};
</script>

<style lang="scss" scoped></style>
