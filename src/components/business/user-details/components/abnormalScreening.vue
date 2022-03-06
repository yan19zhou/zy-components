<!--
 * @Description: 异常排查
 * @Author: zhouy
 * @Date: 2021-07-30 10:00:03
 * @LastEditTime: 2021-07-30 11:23:53
 * @LastEditors: zhouy
-->
<template>
  <div>
    <Adialog ref="adialog" />
  </div>
</template>

<script>
import Adialog from "@/views/yq-personnel/abnormalScreening/dialog.vue";
import { mixinsId } from "../mixin/mixinId";
export default {
  name: "abnormalScreening",
  mixins: [mixinsId],
  inject: ["personId", "row"],
  components: { Adialog },
  mounted () {
     this.queryData() ;
  },
  methods: {
    queryData() {
      this.$refs.adialog.changeVisible({ preview: "preview", row: this.row() });
    },
  },
};
</script>

<style lang="scss" scoped></style>
