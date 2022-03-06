<!--
 * @Description: 
 * @Author: zhouy
 * @Date: 2021-08-16 17:54:17
 * @LastEditTime: 2021-09-10 21:12:50
 * @LastEditors: zhouy
-->
<template>
  <el-popover placement="bottom" width="100%" trigger="click" v-model="delFlagVisibleAreadiog">
    <el-tree
      class="filter-tree"
      style="width:200px"
      lazy
      :data="options"
      :load="loadNode"
      :props="{
        children: 'children',
        label: 'divisionName'
      }"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      accordion
      @node-click="handleCheck"
      ref="divisionTree"
    ></el-tree>
    <el-input
      v-halfCharCode
      slot="reference"
      maxlength="30"
      placeholder="请选择"
      v-model="hotelStreet"
      :suffix-icon="
        delFlagVisibleArea
          ? 'el-icon-arrow-up'
          : 'el-icon-arrow-down'
      "
      clearable
      @clear="clearBelongto"
    />
  </el-popover>
</template>

<script>
import { getDivision } from "@/admin/api/division";
import { mapState } from "vuex";
export default {
  data() {
    return {
      options: [],
      delFlagVisibleArea: false,
      delFlagVisibleAreadiog: false,
      hotelStreet: "",
      belongto: "",
    };
  },
  props: {
    name:String,
    value:{}
  },
  computed: {
    ...mapState({
      user: (state) => state.user.user,
    }),
  },
  created() {
    if(this.value) this.hotelStreet = this.user.divisionName;
  },
  methods: {
    // 部门过滤
    filterNode (value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
		async loadNode (node, resolve) {
			let data = [];
			const response = await getDivision({
				lazy: true,
				parentId: node.data.divisionCode ? node.data.divisionCode : "000000",
			});
			data = response.data.data;
			resolve(data);
		},
    handleCheck (data) {
      this.delFlagAreadiog = data.divisionCode;
      this.hotelStreet = data.divisionName;
      this.belongto = data.divisionCode;
      this.delFlagVisibleAreadiog = false;
    },
    clearBelongto() {
      this.belongto = "";
    }
  },
  watch: {
    value(val) {
      console.log("value==",val);
      if (!val)  this.hotelStreet = "";
    },
    belongto (val) {
      this.$emit('input', val);
    },
  },
};
</script>

<style lang="scss" scoped></style>
