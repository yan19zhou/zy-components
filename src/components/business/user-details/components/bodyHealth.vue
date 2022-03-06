<!--
 * @Author: zhouy
 * @LastEditTime: 2021-07-30 15:55:20
 * @Description: 健康排查
 * @LastEditors: zhouy
-->
<template>
  <div>
    <Adialog ref="adialog" :personData="formData" healthType="preview" />
  </div>
</template>

<script>
import Adialog from "@/views/yq-personnel/components/healthScreening/index.vue";
import { mixinsId } from "../mixin/mixinId";

export default {
  name: "bodyHealth",
  mixins: [mixinsId],
  inject: ["personId", "row"],
  components: {
    Adialog,
  },
  mounted() {
     this.queryData();
  },
  computed: {
    formData() {
      return this.row();
    },
  },
  methods: {
    queryData() {
      this.$refs.adialog.newly();
    },
  },
};
</script>

<style lang="scss" scoped></style>
