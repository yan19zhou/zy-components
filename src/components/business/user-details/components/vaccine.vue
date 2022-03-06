<!--
 * @Description: 疫苗接种
 * @Author: zhouy
 * @Date: 2021-07-30 10:29:39
 * @LastEditTime: 2021-07-30 10:30:32
 * @LastEditors: zhouy
-->
<template>
  <div class="basic-form">
    <Sample
      ref="vaccine"
      :personId="id"
      type="vaccine"
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