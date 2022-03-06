<!--
 * @Description: 核酸采样
 * @Author: zhouy
 * @Date: 2021-10-08 09:52:18
 * @LastEditTime: 2021-10-08 11:36:41
 * @LastEditors: zhouy
-->
<template>
  <div class="basic-form">
    <Sample
      ref="hscyck"
      :personId="id"
      type="hscyck"
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
  name: "cSample",
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
