<!--
 * @Author: xjt
 * @Date: 2021-06-26 11:16:01
 * @LastEditTime: 2021-10-08 14:46:43
 * @Description: 离店登记
 * @LastEditors: zhouy
-->
<template>
  <div
    class="basic-form"
    v-loading="loading"
    element-loading-text="数据加载中..."
  >
    <el-form
      ref="form"
      class="form-wrap preview-form"
      size="small"
      :model="formData"
    >
      <el-form-item label="离点类型" prop="movePersonType">
        {{ formData.personState | dict("person_state") }}</el-form-item
      >
      <el-form-item label="离点时间" prop="hotelName">{{
        formData.leaveHotelDate
      }}</el-form-item>
      <el-form-item label="解除隔离时间" prop="hotelName">{{
        formData.releaseIsolationDate
      }}</el-form-item>
      <template v-if="formData.personState == '41'">
        <el-form-item label="医院名称" prop="hotelName">{{
          formData.leaveDestHospitalName
        }}</el-form-item>
      </template>

      <el-form-item
        label="离点目标地址（省市区）"
        v-if="formData.personState != '41'"
        prop="hotelName"
        >{{ formData.address }}</el-form-item
      >
      <template>
        <!-- 【ID1004619】  （陈庆功修改 去掉了根据人员状态的 if 判断）
        历史隔离人员列表--离点信息所有人员状态增加详细地 -->
        <el-form-item label="详细地址" prop="hotelName">{{
          formData.leaveDestAddress
        }}</el-form-item>
      </template>
      <el-form-item label="备注" prop="remark">{{
        formData.remark
      }}</el-form-item>
    </el-form>
    <orgnaization-business :formData="formData" :isAdd="false"></orgnaization-business>
  </div>
</template>

<script>
import { getSelectLeaveInfo } from "../api/info";
import { getAreaTreeVoByParentId } from "@/views/yq-personnel/api/check.js";
export default {
  name: "leaveInfo",
  inject: ["moveInfoId"],
  computed: {
    id() {
      return this.moveInfoId();
    },
  },
  watch: {
    id() {
      this.queryData();
    },
  },
  data() {
    return {
      tableData: [],
      // 页面loading
      loading: false,
      formData: {
        address: "",
        movePersonType: "",
        leaveHotelDate: "",
        leaveDestAddress: "",
      },
    };
  },
  mounted() {
    this.queryData();
    this.$bus.$on("previewInfoOpen", () => {
      this.queryData();
    });
  },
  methods: {
    async getAreaTree() {
      let {
        leaveDestProvince,
        leaveDestination,
        leaveDestArea,
        leaveDestStreet,
      } = this.formData;
      let params = {};
      let response;
      let arr = [];
      if (leaveDestArea?.includes("4403")) {
        //市内取 区街道
        let Street = this.formData.leaveDestStreet;
        params = { areaId: Street || leaveDestArea, minLevel: 3 };
        response = await getAreaTreeVoByParentId(params);
        arr = [leaveDestArea, leaveDestStreet];
      } else {
        // 市外取省市区
        params = {
          areaId: leaveDestArea || this.formData.leaveDestination,
          minLevel: 1,
        };
        response = await getAreaTreeVoByParentId(params);
        arr = [leaveDestProvince, leaveDestination, leaveDestArea];
      }
      if (response.data.data?.length) {
        let address = this.getAddress(arr, response.data.data, 0,[]);
        this.formData.address = address.join("/");
      }
    },
    getAddress() {
      const [areas, tree, count,tempArr] = arguments;
      let arr = tempArr;
      let count1 = count;
      tree.map((v, i) => {
        if (v.value == areas[count1]) {
          arr.push(v.label);
          count1++;
          if (count1 == areas.length) {
            return arr;
          }
          if (v.children?.length) {arr
            this.getAddress(areas, v.children, count1,arr);
          }
        }
      });
      return arr;
    },
    queryData() {
      this.loading = true;
      getSelectLeaveInfo(this.id)
        .then((res) => {
          this.formData = Object.assign(this.formData, res.data.data);
          this.formData.address = "";
          this.getAreaTree();
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
