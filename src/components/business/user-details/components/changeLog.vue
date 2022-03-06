<!--
 * @Author: cqg
 * @Date: 2021-07-29 16:39:15
 * @LastEditTime: 2021-08-06 18:19:38
 * @Description: 隔离人员模块=>查看弹窗=>tab项--变更记录(公共)
 * @LastEditors: cqg
-->
<template>
  <dataList pure :pageInfo="pager" :listData="tableData" searchName="keyword">
    <el-table ref="multipleTable" :data="tableData" border>
      <el-table-column label="变更项" align="center" prop="tableComment" />
      <el-table-column label="变更类型" align="center" prop="operateType" />
      <el-table-column label="变更前" align="center" prop="modifyBefore" width="300">
        <template slot-scope="scope">
          <p style="white-space:pre-wrap;text-align:left;">{{scope.row.modifyBefore}}</p>
        </template>
      </el-table-column>
      <el-table-column label="变更后" align="center" prop="modifyAfter" width="300">
        <template slot-scope="scope">
          <p style="white-space:pre-wrap;text-align:left;">{{scope.row.modifyAfter}}</p>
        </template>
      </el-table-column>
      <el-table-column label="变更时间" align="center" prop="moditime" />
      <el-table-column label="变更人" align="center" prop="modipers" />
    </el-table>
  </dataList>
</template>
<script>
import { getIsoLatePage } from '@/components/business/user-details/api/info'
export default {
  name: 'changeLog',
  provide () {
    return {
      initList: this.queryData,
    };
  },
  inject: ["personId", 'changeLogDisplayItems'],
  mounted(){
    // 因为之前有人在dataList组件里加入了忽略健康评估页的接口请求的判断（不知道目的是什么）  所以在这里做判断是否为健康评估页面来发起请求
    // （只有健康评估页面的changeLogDisplayItems字段会传回逗号隔开等多个字符串）
    this.changeLogDisplayItems.split(',').length>1&&this.queryData()
  },
  data () {
    return {
      // 表格列表数据
      tableData: [],
      // 请求参数
      params: {
        current: 1,
        size: 20,
      },
      // 分页
      pager: {
        total: 0, // 总页数
        current: 1, // 当前页数
        size: 20 // 每页显示多少条 
      },
    }
  },
  methods: {
    // 数据请求
    queryData (params = {}) {
      let requestData = { ...this.params, ...params, busId: this.personId(), tableNames: this.changeLogDisplayItems,}
      getIsoLatePage(requestData).then(res => {
        const { current, size, total, records } = res.data.data
        this.tableData = records
        this.params = requestData
        this.pager = { total, current, size }
      })
    },
  }
}
</script>