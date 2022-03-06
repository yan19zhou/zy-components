<!--
 * @Description: 
 * @Author: zhouy
 * @Date: 2021-08-16 17:54:17
 * @LastEditTime: 2021-09-17 17:17:22
 * @LastEditors: zhouy
-->
<template>
  <el-cascader
    :options="options"
    v-model="privateValue"
    clearable
    style="width:100%"
    @change="change"
    :props="{
      checkStrictly: true,
      emitPath: false,
      lazy: true,
      lazyLoad,
    }"
    ref="provinceCity"
  ></el-cascader>
</template>

<script>
import { getAreaTreeVoByParentId } from "@/views/yq-personnel/api/check.js";
export default {
  data() {
    return {
      options: [],
      params: {
        parentId: "",
      },
      privateValue: "",
    };
  },
  props: {
    minLevel: {
      type: Number | String,
      default: 1,
    },
    name: String,
    value: {},
  },
  methods: {
    async lazyLoad(node, resolve) {
      if (node.root && !this.params.areaId) {
        this.params.parentId = this.minLevel == "0" ? "-1" : "000000";
      } else if (node.level != 0) {
        this.params.parentId = node ? node.value : "";
        this.$emit("clearLevel");
      }
      const response = await getAreaTreeVoByParentId(this.params);
      resolve(response.data.data);
    },

    change(e) {
      let data = this.$refs.provinceCity.getCheckedNodes()?.[0];
      this.$emit("input", data);
      /*   console.log(e,this.$refs.provinceCity.getCheckedNodes()); */
    },
  },
  watch: {
    value(val) {
      console.log("value==", val, this.privateValue);
      // this.value===this.privateValue
      if (!val) {
        this.privateValue = "";
      }
      // console.log(this.minLevel, this.params.parentId, val);

      if (this.$refs.provinceCity) {
        this.$refs.provinceCity.dropDownVisible = false; //监听值发生变化就关闭它
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
