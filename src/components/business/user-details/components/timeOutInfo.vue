<!--
 * @Author: xjt
 * @Date: 2021-06-26 11:16:01
 * @LastEditTime: 2021-07-31 09:31:03
 * @Description: 隔离逾期登记
 * @LastEditors: zhouy
-->
<template>
  <div class="basic-form">
    <dataList :pageInfo="pager" :listData="tableData" pure :noPadding="true">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" label="序号" :index="getIndex" width="50"></el-table-column>
        <el-table-column prop="overdueReason" label="逾期原因"></el-table-column>
        <el-table-column prop="roomNum" label="入住房号"></el-table-column>
        <el-table-column prop="rigiTime" label="登记时间" min-width="140"></el-table-column>
        <el-table-column prop="addGlDay" label="增加隔离天数"></el-table-column>
        <el-table-column prop="glEndTime" label="隔离截止时间" min-width="140"></el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="handleBtnClick('edit',scope.row)"
            >修改</el-button>
            <el-button
              size="small"
              type="text"
              icon="el-icon-delete"
              @click="handleBtnClick('delete',scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </dataList>
    <adialog title="编辑" width="600px" ref="dialog" @submit="submit" type="edit"></adialog>
  </div>
</template>

<script>
import { fetchDelayInfo } from "../api/info";
import adialog from "@/views/yq-personnel/overdue/dialog.vue";
import { delDelayInfo } from "@/views/yq-personnel/api/overdue.js";
export default {
  name: "timeOutInfo",
  components: { adialog },
  provide() {
    return {
      //初始化数据
      initList: this.queryData,
    };
  },
  inject: ["moveInfoId"],
  data() {
    return {
      tableData: [],
      params: {
        current: 1,
        size: 20,
      },
      pager: {
        total: 0, // 总页数
        current: 1, // 当前页数
        size: 20, // 每页显示多少条
      },
      // 页面loading
      loading: false,
    };
  },
  mounted() {
    this.$bus.$on("previewInfoOpen", () => {
      this.queryData();
    });
  },
  methods: {
    queryData(params = {}) {
      this.loading = true;
      let requestData = { ...this.params, ...params };
      requestData.moveInfoId = this.moveInfoId();
      fetchDelayInfo(requestData)
        .then((res) => {
          const { current, size, total, records } = res.data.data;
          this.tableData = records;
          this.params = requestData;
          this.pager = { total, current, size };
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 按钮点击监听
    handleBtnClick(type, row) {
      switch (type) {
        case "edit":
          this.$refs.dialog.changeVisible({ type, row });
          break;
        case "delete":
          this.handleDelete(row);
          break;
      }
    },
    // 删除
    handleDelete(row) {
      let _this = this;
      this.$confirm("是否确认删除此数据项?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        // 删除
        delDelayInfo(row.overdueRegiId).then((res) => {
          console.log(_this);
          _this.$message.success("删除成功");
          _this.pager.current = 1;
          _this.queryData();
        });
      });
    },
    submit() {
      this.params.current = 1;
      this.queryData();
    },

    // 获取索引值
    getIndex(index) {
      const { current = 0, size = 0 } = this.pager;
      return (current - 1) * size + (index + 1);
    },
  },

};
</script>

<style lang="scss" scoped>
</style>

