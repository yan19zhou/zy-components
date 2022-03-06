<!--
 * @Author: xjt
 * @Date: 2021-06-26 11:16:01
 * @LastEditTime: 2021-06-26 13:54:47
 * @Description: 隔离点信息
 * @LastEditors: xjt
-->
<template>
  <div class="basic-form">
    <el-form ref="form" class="form-wrap preview-form" size="small" :model="formData">
      <el-form-item label="隔离点名称" prop="hotelName">{{formData.hotelName}}</el-form-item>
      <el-form-item label="所属区划" prop="hotelStreet">{{formData.hotelStreet}}</el-form-item>
      <el-form-item label="隔离点类型" prop="hotelType">{{formData.hotelType | dict('hotel_type')}}</el-form-item>
      <el-form-item label="详细地址" prop="hotelAddr">{{formData.hotelAddr}}</el-form-item>
      <el-form-item label="楼层数量" prop="floorNum">{{formData.floorNum}}</el-form-item>
      <el-form-item label="隔离人员居住楼层" prop="livingFloor">{{formData.livingFloor}}</el-form-item>
      <el-form-item label="楼道及周边是否安装视频监控" prop="isMonitor">{{formData.isMonitor | dict("is_valid")}}</el-form-item>
      <el-form-item label="是否配备楼道安保" prop="isSecurity">{{formData.isSecurity | dict("is_valid")}}</el-form-item>
      <el-form-item label="分配房间总数" prop="fjzs">{{formData.fjzs}}</el-form-item>
      <el-form-item label="剩余房间数" prop="syfjs">{{formData.syfjs}}</el-form-item>
      <el-form-item label="隔离点联系人" prop="hotelContact">{{formData.hotelContact}}</el-form-item>
      <el-form-item label="隔离点联系电话" prop="hotelPhone">{{formData.hotelPhone}}</el-form-item>
      <el-form-item label="使用开始时间" prop="useStartTime">{{formData.useStartTime}}</el-form-item>
      <el-form-item label="使用终止时间" prop="useEndTime">{{formData.useEndTime}}</el-form-item>
      <el-form-item class="full" label="备注" prop="remark">{{formData.remark}}</el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getHotelInfo } from "../api/info";
export default {
  name: "hotelInfo",
  inject: ["hotelBaseInfoId"],
  data() {
    return {
      formData: {},
    };
  },
  mounted() {
    this.queryData();
  },
  computed: {
    hotelId() {
      return this.hotelBaseInfoId()
    }
  },
  watch: {
    hotelId() {
      this.queryData();
    }
  },
  methods: {
    async queryData() {
      let res = await getHotelInfo(this.hotelId);
      this.formData = res.data.data;
      sessionStorage.setItem("hotelName",this.formData.hotelName)
    },
  },

};
</script>

<style lang="scss" scoped>
</style>
