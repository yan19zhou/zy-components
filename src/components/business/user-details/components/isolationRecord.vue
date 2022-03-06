<!--
 * @Description: 隔离档案
 * @Author: zhouy
 * @Date: 2021-07-30 20:08:19
 * @LastEditTime: 2021-09-27 16:09:05
 * @LastEditors: cqg
-->

<template>
  <basic-container v-loading="loading" element-loading-text="数据加载中...">
    <dataList
      pure
      :listData="tableData"
      :dataInfo="dataInfo"
      :operaInfo="operaInfo"
      operaColumnWidth="120"
      :openIndex="true"
      @btn-click="handleBtnClick"
    ></dataList>
    <InfoTabs
      ref="userDetails"
      :componentHideIds="componentIds"
      :key="key"
      active="userInfo"
    ></InfoTabs>
  </basic-container>
</template>

<script>
import { getIsolationRecordList } from "@/views/yq-personnel/api/shiftTo.js";
// import InfoTabs from "../index.vue";
import { extractName } from "@/utils/extract";
import dateFormate from "@/assets/js/date";
import { mixinsId } from "../mixin/mixinId";
export default {
  name: "isolationRecord",
  components: {
    InfoTabs:()=>import("../index.vue")
  },
  mixins: [mixinsId],
  inject: ["personId", "row"],
  provide() {
    return {
      initList: this.queryData,
      personId: () => this.currentRow.oldPersonId,
      moveInfoId: () => this.currentRow.oldMoveInfoId,
      hotelBaseInfoId: () => this.currentRow.oldHotelBaseInfoId,
    };
  },

  data() {
    return {
      // 表格列表数据
      tableData: [],
      componentIds: [],
      currentRow: {},
      loading: false,
      key:""
    };
  },
  computed: {
    dataInfo() {
      return [
        { label: "姓名", prop: "name", width: "120px" },
        {
          label: "性别",
          prop: "gender",
          width: "100px",
          formatter: this.dataFormatter,
        },
        { label: "年龄", prop: "age", width: "100px" },
        { label: "电话号码", prop: "telPhone", width: "160px" },
        { label: "所在隔离点", prop: "hotelName", width: "160px" },
        {
          label: "入住时间",
          prop: "moveStartTime",
          formatter: this.dataFormatter,
          sortable: true,
          asc: null,
        },
        {
          label: "解除离点时间",
          prop: "moveEndTime",
          formatter: this.dataFormatter,
          sortable: true,
          asc: null,
        },
      ];
    },
    // 操作按钮
    operaInfo() {
      return [
        {
          label: "查看档案",
          name: "preview",
        },
      ];
    },
  },
  methods: {
    // 数据请求
    queryData() {
      this.loading = true;
      let requestData = {
        personId: this.personId(),
      };
      getIsolationRecordList(requestData)
        .then((res) => {
          const { records } = res.data.data;
          this.tableData = records;
          console.log(this.tableData);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //格式化表格字典值
    dataFormatter(row, column, cellValue) {
      switch (column.property) {
        case "gender":
          return extractName("gender", row.gender);

        case "moveEndTime":
          return (
            row.moveEndTime &&
            dateFormate.datasng(row.moveEndTime, "yyyy-MM-dd")
          );
        case "moveStartTime":
          return (
            row.moveStartTime &&
            dateFormate.datasng(row.moveStartTime, "yyyy-MM-dd")
          );
        default:
          break;
      }
    },
    //表格按钮点击事件监听
    handleBtnClick({ type, row }) {
      this.currentRow = row;
      this.$nextTick(() => {
        this.$refs.userDetails.show({ type, row });
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
