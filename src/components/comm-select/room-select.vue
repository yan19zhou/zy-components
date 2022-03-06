<template>
  <div class="v-dialog cCommonSelect">
    <el-dialog
      :visible.sync="isOpen"
      :width="width"
      :fullscreen="fullscreen"
      @close="close"
      :append-to-body="true"
      :custom-class="!fullscreen ? 'dialog-fullscreen': ''"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div slot="title">
        <div class="flex-bc mr20 dialog-title">
          <div class="left">物业选择</div>
          <div class="right pr20">
            <span class="el-icon-full-screen cursor" @click="fullscreen=!fullscreen"></span>
          </div>
        </div>
      </div>
      <div v-loading="loading" element-loading-text="数据加载中...">
        <dataList
          placeholder="请输入物业名称查询"
          :pageInfo="pager"
          :listData="tableData"
          :selectData="selectDataArr"
          searchName="propertyName"
          :menuList="[]"
          layout="total, prev, pager, next"
          noPadding
          openSelection
        >
          <el-table ref="roomTable" :data="tableData" stripe @selection-change="$event => (selectDataArr = $event)">
            <el-table-column width="55" type="selection" :selectable="canSelected" />
            <el-table-column prop="propertyName" label="物业名称" width="250" />
            <!--<el-table-column prop="projectName" label="项目名称" width="180"  v-show="type=='1' || type=='3'" />-->
            <el-table-column prop="buildingArea" label="建筑面积(㎡)" width="150" />
            <el-table-column prop="price" label="市场评估租金单价(元/㎡/月)" width="180" v-if="type=='1'" />
            <el-table-column prop="manageUnit" label="管理所" width="150">
              <template slot-scope="scope">{{scope.row.manageUnit | dict("administrative_office")}}</template>
            </el-table-column>>
          </el-table>
        </dataList>
      </div>
      <div v-show="type=='1'">备注：当前展示的可选择的物业，为经营性物业并且是空置状态的，排除了已被其他合同关联引用的物业（包含合同草稿、待提交、待接收、拒绝接收、待核算、已核算、核算不同意、变更中、执行中关联的物业）</div>
      <div slot="footer">
        <el-button @click="ok">确定</el-button>
        <el-button @click="close">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
//物业选择组件
import { getRoomPriceByName } from '@/views/wy-rent/api/rent-price'

export default {
  name: 'room-select',
  props: {
    // 宽度
    width: {
      type: String,
      default: '1000px',
    },
    // 禁用选择项
    disabledArr: {
      type: Array,
      default: () => [],
    },
  },
  provide () {
    return {
      initList: this.queryData,
    }
  },
  data () {
    return {
      type: '', //'1'租赁 '2'外租
      contractId: '',//合同id,选择时传入合同ID，以便对物业过滤时，本合同的不过滤掉
      isOpen: false,
      fullscreen: false,
      isInit: true,
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      // 表格列表数据
      tableData: [],
      // 请求参数
      params: {
        current: 1,
        size: 10,
        propertyName: '',
      },
      // 选中的数据
      selectDataArr: [],
      // 分页
      pager: {
        total: 0, // 总页数
        current: 1, // 当前页数
        size: 10, // 每页显示多少条
      },
      // 页面loading
      loading: false,
    }
  },

  methods: {
    // 数据请求
    queryData (params = {}) {
      this.loading = true
      let req = { ...this.params, ...params, ...{ type: this.type, contractId: this.contractId } }
      getRoomPriceByName(req)
        .then((res) => {
          const { current, size, total, records } = res.data.data
          this.tableData = records
          this.params = req
          this.pager = { total, current, size }
        })
        .finally(() => {
          this.loading = false
        })
    },
    show (type, contractId) {
      this.type = type
      this.contractId = contractId;
      this.isOpen = true
      if (this.isInit) {
        this.isInit = false
        this.queryData()
      }
    },

    ok () {
      this.$emit('completeSelect', this.selectDataArr)
      this.isOpen = false
    },

    close () {
      this.isInit = true
      this.selectDataArr.length = 0
      this.params.propertyName = ''
      this.isOpen = false
    },
    // 判断数据列表是否可选择
    canSelected (row) {
      if (!this.disabledArr.length) return 1
      return this.disabledArr.includes(row.roomId) ? 0 : 1
    },
  },
}
</script>

<style lang="scss" >
@import "./scss/commonSelect";
</style>


