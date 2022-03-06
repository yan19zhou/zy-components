<!--
 * @Author: xjt
 * @Date: 2020-12-09 15:33:46
 * @LastEditTime: 2021-07-26 18:20:16
 * @Description: 公共选择数据弹窗
-->
<template>
  <el-dialog append-to-body :width="width" :title="title" :visible.sync="chooseVisible" :close-on-click-modal="false" custom-class=" cBasicChooseDialog" @closed="handleClosed">
    <div class="dialogWrap" v-if="chooseVisible" v-loading="loading">
      <dataList
        noPadding
        openSelection
        :pageInfo="pager"
        :listData="tableData"
        :menuList="[]"
        :searchName="searchKey"
        :listLayout="listLayout"
        :filterList="filterItemList"
        :placeholder="placeholder"
        :selectData="selectDataArr"
        layout="total, prev, pager, next"
      >
        <el-table :class="!multiple && 'hideSelectAll'" ref="multipleTable" :data="tableData" @selection-change="handleSelect" :row-key="(row)=>{ return row[primaryKey]}">
          <el-table-column type="selection" width="55" :selectable="canSelected" :reserve-selection="reserveSelection" />
          <el-table-column label="序号" type="index" width="50" v-if="showIndex" />
          <el-table-column v-for="item in showData" :key="item[primaryKey]" v-bind="item" :show-overflow-tooltip="item.showOverflowTooltip||false" />
        </el-table>
      </dataList>
    </div>
    <div slot="footer">
      <slot name="submitButton" :selectDataArr="selectDataArr">
        <el-button size="medium" @click="chooseVisible = false">关闭</el-button>
        <el-button size="medium" type="primary" @click="confirmChoose">确定选择</el-button>
      </slot>
    </div>
  </el-dialog>
</template>

<script>
import filterBox from './components/filterBox'

import request from '@/plugins/axios'
export default {
  name: 'basicChooseDialog',
  components: {
    filterBox,
  },
  props: {
    // 弹窗标题
    title: {
      type: String,
      default: '请选择'
    },
    // 弹窗宽度
    width: {
      type: String,
      default: '500'
    },
    // 搜索提示框
    placeholder: {
      type: String,
      default: '请输入'
    },
    // 接口地址
    url: {
      type: String,
      default: ''
    },
    // 接口方法
    method: {
      type: String,
      default: 'get'
    },
    // 需要显示的列表字段
    showData: {
      type: Array,
      default: () => []
    },
    // 主键键名
    primaryKey: {
      type: String,
      default: ''
    },
    // 搜索关键词的参数名称
    searchKey: {
      type: String,
      default: 'keyword'
    },
    // 隐藏搜索框
    hideSearch: {
      type: Boolean,
      default: false
    },
    // 显示序号
    showIndex: {
      type: Boolean,
      default: false
    },
    // 需要返回的字段名称列表,假如不填默认返回全部字段
    returnData: {
      type: Array,
      default: () => []
    },
    // 禁用选择项
    disabledArr: {
      type: Array,
      default: () => []
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false,
    },
    //过滤筛选项
    filterItemList: {
      type: Array,
      default: () => [],
    },
    //列表请求默认参数
    defaultParams: {
      type: Object,
      default: () => { },
    },
    // 多选翻页状态保持
    reserveSelection: {
      type: Boolean,
      default: false
    },
  },
  provide () {
    return {
      initList: this.queryData,
    }
  },
  data () {
    return {
      loading: false,
      // 弹窗控制器
      chooseVisible: false,
      // 表格列表数据
      tableData: [],
      // 请求参数
      params: {
        current: 1,
        size: 10,
      },
      // 分页
      pager: {
        total: 0, // 总页数
        current: 1, // 当前页数
        size: 10 // 每页显示多少条
      },
      // 选中的数据
      selectDataArr: [],
    }
  },
  computed: {
    // 处理列表组件的内容模块
    listLayout () {
      return this.hideSearch ? ['filter'] : ['search', 'menu', 'filter']
    },
  },
  methods: {
    // 弹窗开启
    show (type) {
      this.chooseVisible = true
      // this.queryData(this.defaultParams)
    },
    // 条件筛选
    handleFilterInputChange (val, data) {
      if (val !== '') {
        // 筛选项日期区间处理
        if (['datetimerange', 'daterange'].includes(data.inputType) && Array.isArray(data.name)) {
          const [startName, endName] = data.name
          const [startTime, endTime] = val
          data.name[startName] = startTime
          data.name[endName] = endTime
        } else if (['numberRange'].includes(data.inputType) && Array.isArray(data.name)) {
          const { valid, form } = data.getFormData()
          const [startName, endName] = data.name
          const { min, max } = form
          data.name[startName] = min
          data.name[endName] = max
        }
      };
      // 数值区间校验
      this.queryData({ current: 1, ...{ [data.name]: val } })
    },
    // 确定选择
    confirmChoose () {
      if (this.selectDataArr.length == 0) {
        return this.$message.warning('选择数据不能为空')
      }
      if (this.returnData.length == 0) {
        // 防止数据被污染，深拷贝一下上报数据
        this.$emit('chooseData', JSON.parse(JSON.stringify(this.multiple ? this.selectDataArr : this.selectDataArr[0])))
      } else {
        let arr = this.selectDataArr.map(item => {
          let data = {}
          this.returnData.forEach(key => {
            data[key] = item[key]
          })
          return data
        })
        this.$emit('chooseData', this.multiple ? arr : arr[0])
      }
      this.chooseVisible = false
    },
    // 请求数据
    queryData (params = {}) {
      this.loading = true
      if (!this.url) {
        return new Error('接口地址不能为空')
      }
      let requestData = { ...this.defaultParams, ...this.params, ...params, }
      if (requestData.addr == '') {
        requestData.addr = '深圳市'
      }
      request({
        url: this.url,
        method: 'get',
        params: requestData,

      }).then(res => {
        this.loading = false
        if (Object.prototype.toString.call(res.data.data) === "[object Object]") {
          const { current, size, total, records, pages } = res.data.data
          this.$emit('loadCompleted', records)
          this.tableData = records
          this.params = requestData
          this.pager = { current, size, total, pages }
        } else {
          const records = res.data.data
          this.$emit('loadCompleted', records)
          this.tableData = records
        }

      })
    },
    // 监听勾选
    handleSelect (val, row) {
      if (!this.multiple) {
        if (val.length > 1) {
          this.$refs.multipleTable.clearSelection()
          this.$refs.multipleTable.toggleRowSelection(val[val.length - 1])
        }
        this.selectDataArr = [val.pop()];
      } else {
        this.selectDataArr = val
      }
    },
    // 判断数据列表是否可选择
    canSelected (row) {
      if (!this.disabledArr.length) return 1
      return this.disabledArr.includes(row[this.primaryKey]) ? 0 : 1
    },
    // 弹窗关闭初始化
    handleClosed () {
      this.params = { current: 1, size: 10 }
      this.pager = { total: 0, current: 1, size: 10 }
      this.tableData.length = 0
      this.selectDataArr.length = 0
    },
  }
}
</script>

<style lang="scss"  >
.cBasicChooseDialog {
  /deep/ .el-dialog__body {
    padding: 22px;
    .el-table__empty-block {
      width: 100% !important;
    }
  }
  .searchPanel {
    //display: none;
  }
  // 如果没有多选的话，隐藏列表多选按钮
  /deep/ .hideSelectAll thead.has-gutter {
    .el-table-column--selection .el-checkbox {
      opacity: 0;
      pointer-events: none;
    }
  }
}
</style>
