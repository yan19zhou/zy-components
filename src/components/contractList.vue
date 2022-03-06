// 合同列表组件(左边合同右边列表的左边)
<template>
  <div class="cContractList">
    <div class="cTitle">
      合同基本信息
      <el-popover popper-class="cFilterListWrap" placement="bottom" width="600" trigger="click" v-model="popVisible" v-show="filterList.length">
        <div class="filterList">
          <ul>
            <li v-for="(item, index) in filterData" :key="index">
              <filterInput
                :ref="`filterItem${index}`"
                v-bind="item"
                :children="item.isLink ? linkFilterOptions[item.name]:(item.children || [])"
                binding
                showAll
                @input="handlePopInputChange($event, item)"
                @linkFilterChange="handleLinkFilterChange"
              />
            </li>
          </ul>
          <div class="operaBtn">
            <el-button size="small" @click="resetFilter">重置</el-button>
            <el-button type="primary" size="small" @click="handleFilter">确定</el-button>
          </div>
        </div>
        <el-button class="filterBtn" type="text" v-show="filterList.length" slot="reference">
          更多筛选
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
      </el-popover>
    </div>
    <div class="search">
      <el-input v-halfCharCode :placeholder="placeholder" v-model="searchKeywords" clearable @clear="handleClear" @change="handleSearch">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <div class="scrollWrap" v-scrollBar>
      <slot />
    </div>
    <pager layout="total,prev, pager, next" :pageInfo="pageInfo" :hideSelectTips="true" @changeCurrentPage="changeCurrentPage" @changePageSize="changePageSize" />
  </div>
</template>

<script>
import filterInput from '@/components/dataList/components/filterInput'
import pager from '@/components/dataList/components/pager'
export default {
  name: 'contractList',
  components: {
    pager,
    filterInput,
  },
  inject: ['updateList'],
  props: {
    // 搜索框提示语
    placeholder: {
      type: String,
      default: '请输入内容',
    },
    // 搜索关键词对应的键名
    searchName: {
      type: String,
      default: 'keywords',
    },
    // 分页数据
    pageInfo: {
      type: Object,
      default: () => ({
        total: 0, // 总页数
        current: 1, // 当前页数
        size: 10, // 每页显示多少条
      }),
    },
    // 是否隐藏更多筛选按钮
    hideFilterBtn: {
      type: Boolean,
      default: true,
    },
    filterList: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      // 暂存筛选参数（防止页面请求时，参数合并造成数据重置失效）
      formData: {},
      // 条件筛选选中项
      choosedFilterList: [],
      popVisible: false,
      // 搜索关键词
      searchKeywords: '',
    }
  },
  computed: {
    // 初始化筛选列表
    filterData () {
      if (!this.filterList.length) return [];
      let values = new Map()
      this.filterList.forEach(item => {
        item.defaultValue != undefined && values.set(item.name, item.defaultValue)
      })
      // 获取联动筛选可选值
      this.setLinkFilterOptions()
      let linkNames = this.filterList.reduce((arr, i) => i.linkName ? [...arr, i.linkName] : arr, [])
      values.size && setTimeout(() => this.setFilter(values), 0)
      return this.filterList.map((item, index) => ({ ...item, filterName: `filterItem${index}`, isLink: linkNames.includes(item.name), binding: false }))
    },
  },
  methods: {
    // 联动筛选项可选值获取
    setLinkFilterOptions () {
      let linkFilterOptions = {}
      this.filterList.forEach(item => {
        if (!!item.linkName) {
          let linkFilterInput = this.filterList.find(i => i.name === item.linkName)
          if (linkFilterInput) {
            linkFilterOptions[item.linkName] = linkFilterInput.children || this.getDict(linkFilterInput.dictName) || []
          }
        }
      })
      this.linkFilterOptions = linkFilterOptions
    },
    // 修改当前页
    changeCurrentPage (current) {
      this.updateList({ current })
    },
    // 修改单页条数
    changePageSize (size) {
      this.updateList({ current: 1, size })
    },
    // 下拉选择值
    selectChange (val, name) {
      this.updateList({
        [this.searchName]: this.searchKeywords,
        [name]: val,
        current: 1,
      })
    },
    // 删除搜索关键词
    handleClear () {
      this.updateList({ [this.searchName]: '', current: 1 })
    },
    // 关键词搜索
    handleSearch (val) {
      this.updateList({ [this.searchName]: val, current: 1 })
    },
    // 重置筛选
    resetFilter (saveFilterItem = false) {
      let formData = {}
      this.filterData.forEach((item, index) => {
        let ref = this.$refs[`filterItem${index}`][0]
        ref.clear()
        if (['datetimerange', 'daterange', 'numberRange'].includes(ref.inputType) && Array.isArray(ref.name)) {
          const [startName, endName] = ref.name
          formData[startName] = ''
          formData[endName] = ''
        } else {
          formData[ref.name] = ref.multiple || ref.inputType == 'checkbox' ? [] : ''
        }
      })
      this.popVisible = false
      this.$emit('resetFilter')
      this.updateList({ current: 1, ...formData })
      !saveFilterItem && (this.choosedFilterList.length = 0)
    },
    // 联动筛选项改变监听
    handleLinkFilterChange ({ name, value }) {
      let filterItem = this.filterList.find(i => i.name === name)
      let filterItemIndex = this.filterList.findIndex(i => i.name === name)
      let linkFilter = this.filterList.find(i => i.linkName === name)?.linkFunction
      let newList = linkFilter ? linkFilter({ list: filterItem.children, value }) : filterItem.children.filter(i => i.value.includes(value))
      this.linkFilterOptions[name] = newList
      let ref = this.$refs[`filterItem${filterItemIndex}`][0]
      !['[]', ''].includes(JSON.stringify(ref.filterValue)) && ref.clear()
    },
    // 条件筛选
    handleFilter () {
      let formData = {}
      let choosedFilterList = []
      let validate = true;
      this.filterData.forEach((item, index) => {
        let ref = this.$refs[`filterItem${index}`][0]
        if (ref.filterValue !== '') {
          // 筛选项日期区间处理
          if (['datetimerange', 'daterange'].includes(ref.inputType) && Array.isArray(ref.name)) {
            const [startName, endName] = ref.name
            const [startTime, endTime] = ref.filterValue
            formData[startName] = startTime
            formData[endName] = endTime
          } else if (['numberRange'].includes(ref.inputType) && Array.isArray(ref.name)) {
            const { valid, form } = ref.getFormData()
            const [startName, endName] = ref.name
            const { min, max } = form
            formData[startName] = min
            formData[endName] = max
            validate = valid

          } else {
            formData[ref.name] = ref.filterValue
          }
          if (this.filterType === 'default' && ref.filterValue !== '' && JSON.stringify(ref.filterValue) != '[]' && JSON.stringify(ref.filterValue) != `{"min":"","max":""}`) {
            choosedFilterList.push({
              ...item,
              inputType: ['checkbox', 'radio'].includes(item.inputType) ? 'select' : item.inputType,
              value: ref.filterValue,
              multiple: item.inputType == 'checkbox' ? true : !!item.multiple
            })
          }
        };
      })
      // 数值区间校验
      if (!validate) return;
      // 重置逻辑处理
      Object.keys(this.formData).forEach(item => {
        if (formData[item] == undefined) {
          formData[item] = ''
        }
      })

      this.formData = formData
      this.popVisible = false
      this.choosedFilterList = choosedFilterList
      this.updateList({ current: 1, ...formData })
    },
    // 条件筛选后双向绑定
    handlePopInputChange (val, data) {
      if (!this.choosedFilterList.length) return;
      this.choosedFilterList.forEach((item, index) => {
        if (item.filterName == data.filterName) {
          const ref = this.$refs[`chooseFilterItem${index}`][0]
          ref.setVal(val)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped >
.cContractList {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .cTitle {
    width: 100%;
    position: relative;
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    font-size: 16px;
    font-weight: 600;
    border-bottom: 1px solid rgba(97, 106, 120, 0.07);
  }
  .search {
    padding: 0 20px;
    height: 50px;
    display: flex;
    align-items: center;
    .el-input {
      width: 300px;
    }
  }
  .seleect {
    padding: 0 20px;
    height: 50px;
    display: flex;
    align-items: center;
    .el-select {
      width: 60%;
    }
  }
  .scrollWrap {
    flex: 1;
    padding: 10px 0px;
  }
  /deep/ .pager-box {
    border-top: 1px solid rgba(97, 106, 120, 0.07);
    height: 50px;
    margin-bottom: 0;
    padding: 0 20px;
    justify-content: flex-end;
  }
}
.cFilterListWrap {
  /deep/ .filterList {
    li {
      margin-bottom: 10px;
    }
  }
  .operaBtn {
    border-top: 1px solid #ebeef5;
    padding-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
.filterBtn {
  color: #666;
  position: absolute;
  right: 40px;
  top: 10px;
  margin: 0 auto;
}
</style>
