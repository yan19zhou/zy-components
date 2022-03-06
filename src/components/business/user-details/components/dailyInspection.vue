<!--
 * @Description: 心理巡诊
 * @Author: zhouy
 * @Date: 2021-07-30 09:58:28
 * @LastEditTime: 2021-07-30 17:20:03
 * @LastEditors: zhouy
-->
<template>
  <div class="basic-from abow_dialog">
    <dailyInspection ref="dailyInspection" class="preview-daily" />
  </div>
</template>

<script>
import dailyInspection from "@/views/yq-personnel/dailyInspection/components/dailyInspection";
import { mixinsId } from "../mixin/mixinId";
export default {
  name: "DailyInspection",
  mixins: [mixinsId],
  inject: ["personId", "row"],
  components: {
    dailyInspection,
  },
  mounted() {
     this.queryData();
  },
  methods: {
    queryData() {
      this.$refs.dailyInspection.show("preview", this.row());
    },
  },
};
</script>

<style lang="scss" scoped>
.preview-daily {
  display: grid;
  grid-template-columns: 65% 35%;
  grid-gap: 20px;
}
</style>
<style lang="scss">
.preview-daily {
  .historyDialog {
    position: relative !important;
    right: 0 !important;
    width: auto !important;
    border: none;
  }
}
</style>
