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
      <div>
        <el-row>
          <el-col align="left" :span="24">
            单位类型:
            <el-select clearable v-model="unitType" placeholder="请选择单位类型" class="ddlWidth1" @change="queryData">
              <el-option v-for="item in unitTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <div v-loading="loading" element-loading-text="数据加载中...">
        <dataList
          placeholder="请输入单位名称查询"
          :pageInfo="pager"
          :listData="unitInfos"
          :selectData="selectedUnitInfos"
          searchName="keyword"
          layout="total, prev, pager, next"
          :listLayout="['search']"
          noPadding
          openSelection
        >
          <el-table ref="roomTable" :data="unitInfos" stripe @selection-change="$event => (selectedUnitInfos = $event)">
            <el-table-column width="55" type="selection" :selectable="canSelected" />
            <el-table-column prop="unitName" label="单位名称" />
            <el-table-column prop="unitType" label="单位类型" :formatter="unitTypesFormater" width="180" />
          </el-table>
        </dataList>
      </div>
      <div slot="footer">
        <el-button @click="ok">确定</el-button>
        <el-button @click="close">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
//物业选择组件
import { getDict } from '@/utils'
import { getUnitList } from '@/views/wy-rent/api/rent-price'
export default {
  name: 'apply-unit-select',
  props: {
    // 宽度
    width: {
      type: String,
      default: '800px'
    },
    // 禁用选择项
    disabledArr: {
      type: Array,
      default: () => []
    },
  },
  provide () {
    return {
      initList: this.queryData,
    };
  },
  data () {
    return {
      unitType: '',
      unitName: '',
      isOpen: false,
      isInit: true,
      fullscreen: false,
      unitInfos: [], //单位列表
      selectedUnitInfos: [], //当前选择的单位列表，
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 请求参数
      params: {
        current: 1,
        size: 10,
        keyword: ''
      },
      // 分页
      pager: {
        total: 0, // 总页数
        current: 1, // 当前页数
        size: 10 // 每页显示多少条
      },
      loading: false,
    }
  },
  computed: {
    unitTypes () {
      return getDict('apply-unit-type')
    },

  },

  methods: {
    unitTypesFormater (row, column, cellValue) {
      let obj = this.unitTypes.find(p => p.value == cellValue)
      return obj ? obj.label : ''
    },
    show () {
      this.isOpen = true;
      if (this.isInit) {
        this.isInit = false;
        this.queryData()
      }
    },
    // 数据请求
    queryData (params = {}) {
      this.unitType,
        this.loading = true
      let requestData = { ...this.params, ...params, ...{ unitTypeList: this.unitType } }
      getUnitList(requestData).then(res => {
        const { current, size, total, records } = res.data.data
        this.unitInfos = records
        this.params = requestData
        this.pager = { total, current, size }
      }).finally(() => {
        this.loading = false
      })
    },
    ok () {
      this.$emit('completeSelect', this.selectedUnitInfos);
      this.isOpen = false;
    },
    close () {
      this.isInit = true;
      this.selectedUnitInfos.length = 0
      this.unitType = ''
      this.isOpen = false;
    },
    // 判断数据列表是否可选择
    canSelected (row) {
      if (!this.disabledArr.length) return 1;
      return this.disabledArr.includes(row.unitId) ? 0 : 1
    }
  },
}
</script>

<style lang="scss" >
@import "./scss/commonSelect";
</style>


