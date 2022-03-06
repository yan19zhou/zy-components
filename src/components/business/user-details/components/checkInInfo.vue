<!--
 * @Author: xjt
 * @Date: 2021-06-26 11:16:01
 * @LastEditTime: 2021-07-31 12:23:41
 * @Description: 入住信息
 * @LastEditors: zhouy
-->
<template>
  <div class="basic-form">
    <infoEdit ref="infoEdit"></infoEdit>
  </div>
</template>

<script>
import infoEdit from "@/views/yq-personnel/multipleManage/components/infoEdit";
import { mixinsId } from "../mixin/mixinId";
export default {
  name: "checkInInfo",
  mixins: [mixinsId],
  inject: ["personId", "row"],
  components: {
    infoEdit,
  },
  mounted() {
    this.queryData();
  },
  methods: {
    queryData() {
      this.$refs.infoEdit.show(this.row(), "preview");
    },
  },
};
</script>

<style lang="scss" scoped></style>
