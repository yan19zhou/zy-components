<!--
 * @Author: xjt
 * @Date: 2021-06-26 10:49:46
 * @LastEditTime: 2021-10-08 10:13:53
 * @Description: 用户综合管理信息预览tab组件
 * @LastEditors: zhouy
-->
<template>
  <el-dialog custom-class="userDetailsInfo el-common-dialog" :title="dialogTitle" :visible.sync="dialogVisible" width="80%" append-to-body @closed="closed" @opened="opened" v-dialogDrag>
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane :label="item.label" :name="item.componentName" v-for="item in panList" :key="item.id">
        <!-- <keep-alive> -->
        <component :is="activeName" v-if="item.componentName === activeName && dialogVisible" :ref="item.componentName"></component>
        <!-- </keep-alive> -->
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import hotelInfo from "./components/hotelInfo.vue"; // 隔离点信息
import checkInInfo from "./components/checkInInfo.vue"; // 入住信息
import userInfo from "./components/userInfo.vue"; // 隔离人员信息
import bodyHealth from "./components/bodyHealth.vue"; // 健康排查
import changeLog from "./components/changeLog.vue"; // 变更日志
import Sample from "./components/sample.vue"; // 核酸结果|
import Vaccine from "./components/vaccine.vue"; //疫苗接种记录
import abnormalScreening from "./components/abnormalScreening.vue"; // 异常排查
import exConvict from "./components/exConvict.vue"; // 前违逃记录
import leaveInfo from "./components/leaveInfo.vue"; // 离点信息
import mentalHealth from "./components/mentalHealth.vue"; //心理评估
import DailyMonitoring from "./components/dailyMonitoring.vue"; //日常监测记录
import DailyInspection from "./components/dailyInspection.vue"; // 心理巡诊
import DsolationRecord from "./components/isolationRecord.vue"; // 隔离档案
import register from "./components/register.vue"; // 流调登记
import RNASample from "./components/RNASample.vue"; //核酸采样
import isolationFiles from "./components/isolationFiles.vue";//隔离文件清单
export default {
  name: "userDetails",
  components: {
    hotelInfo,
    checkInInfo,
    userInfo,
    changeLog,
    Sample,
    Vaccine,
    exConvict,
    abnormalScreening,
    leaveInfo,
    bodyHealth,
    mentalHealth,
    DailyInspection,
    DailyMonitoring,
    DsolationRecord,
    register,
    RNASample,
    isolationFiles
  },
  props: {
    componentHideIds: {
      type: Array,
      default: () => [],
    },
    active: {
      type: String,
      default: "userInfo",
    },
    dialogTitle: {
      type: String,
      default: "详细信息",
    },
  },
  data() {
    return {
      // 弹窗显隐
      dialogVisible: false,
      activeName: "userInfo",
    };
  },
  computed: {
    // tab组件信息
    panList() {
      let initArr = [
        { id: 1, label: "隔离点信息", componentName: "hotelInfo" },
        { id: 3, label: "隔离人员信息", componentName: "userInfo" },
        { id: 2, label: "入住信息", componentName: "checkInInfo" },
        { id: 4, label: "健康排查", componentName: "bodyHealth" },
        { id: 5, label: "心理评估", componentName: "mentalHealth" },
        { id: 15, label: "流调登记", componentName: "register" },
        { id: 6, label: "日常监测记录", componentName: "dailyMonitoring" },
        { id: 16, label: "核酸采样", componentName: "RNASample" },
        { id: 7, label: "核酸结果", componentName: "sample" },
        { id: 8, label: "疫苗记录", componentName: "vaccine" },
        { id: 10, label: "心理巡诊", componentName: "DailyInspection" },
        { id: 13, label: "离点信息", componentName: "leaveInfo" },
        { id: 11, label: "异常排查", componentName: "abnormalScreening" },
        { id: 12, label: "前违逃记录", componentName: "exConvict" },
        { id: 17, label: "隔离文件清单", componentName: "isolationFiles" },
        { id: 14, label: "隔离档案", componentName: "dsolationRecord" },
        { id: 9, label: "操作日志", componentName: "changeLog" },
      ];
      return this.componentHideIds.length ? initArr.filter((item) => !this.componentHideIds.includes(item.id)) : initArr;
    },
  },
  methods: {
    show() {
      this.activeName = this.active;
      this.dialogVisible = true;
    },
    handleTabClick(tab) {},
    closed() {
      sessionStorage.removeItem("hotelName");
    },
    opened() {
      this.$bus.$emit("previewInfoOpen");
    },
  },
  destroyed() {
    this.$bus.$off("previewInfoOpen");
  },
};
</script>
<style lang="scss" scoped>
.dialog-title {
  font-size: 18px;
  margin-right: 16px;
}
.upload-text {
  width: auto;
}
</style>
<style lang="scss">
.userDetailsInfo {
  .el-dialog__body {
    padding: 0 20px;

    .basic-form {
      .form-wrap {
        padding-top: 0;
      }
    }
  }
}
</style>
