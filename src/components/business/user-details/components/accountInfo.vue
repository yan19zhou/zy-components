<!--
 * @Author: xjt
 * @Date: 2021-06-26 11:16:01
 * @LastEditTime: 2021-06-26 14:06:36
 * @Description: 核酸检测
 * @LastEditors: xjt
-->
<template>
  <div class="basic-form">
    <dataList :pageInfo="pager" :listData="tableData" :noPadding="true" pure>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="nucleinTestCase" label="检测情况">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.nucleinTestCase === '21'?'success':'warning'"
            >{{scope.row.nucleinTestCase | dict("nuclein_test_case")}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="nucleinTestTime" label="检测时间"></el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
      </el-table>
    </dataList>
  </div>
</template>
<script>
import { fetchNucleicInfo } from "../api/info";
import {mixinsId} from "../mixin/mixinId"
export default {
  name: "accountInfo",
  mixins: [mixinsId],
  provide() {
    return {
      //初始化数据
      initList: this.queryData,
    };
  },
  inject: ["personId"],
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
     // 去掉页面初始请求，在公共组件中请求
    // this.queryData();
  },
  methods: {
    queryData(params = {}) {
      this.loading = true;
      let requestData = { ...this.params, ...params };
      requestData.personId = this.id;
      fetchNucleicInfo(requestData)
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
  },
};
</script>

<style lang="scss" scoped>
</style>
