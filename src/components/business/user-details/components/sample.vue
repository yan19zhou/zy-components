<!--
 * @Author: xjt
 * @Date: 2021-06-26 11:16:01
 * @LastEditTime: 2021-07-30 14:23:10
 * @Description: 核酸检测sample
 * @LastEditors: zhouy
-->
<template>
  <div class="basic-form">
    <Sample
      ref="sample"
      :personId="id"
      type="sample"
      personType="person"
      :formData="formData"
      isPreview
    />
  </div>
</template>
<script>
import { mixinsId } from "../mixin/mixinId";
import Sample from "@/views/yq-personnel/components/medical/tabs-content/sample.vue";
export default {
  name: "pSample",
  mixins: [mixinsId],
  inject: ["personId",'row'],
  components: {
    Sample,
  },
  computed: {
    formData() {
      return this.row() 
    }
  },

};
</script>

<style lang="scss" scoped></style>
