<!--
 * @Author: xjt
 * @Date: 2021-04-12 09:12:42
 * @LastEditTime: 2021-04-14 10:24:46
 * @Description: 自定义导出组件
 * @LastEditors: xjt
-->
<template>
  <div class="cCustomExport">
    <el-dialog :visible.sync="dialogVisible" :width="width" title="导出数据">
      <div>
        <!-- 自定数据筛选 -->
        <div class="exportFilter" v-if="filterList.length">
          <div class="card-title">根据条件导出</div>
          <div class="filterList">
            <filterInput binding v-for="(item,index) in filterList" :key="index" v-bind="item" @input="handlePopInputChange($event, item)" />
          </div>
        </div>
        <!-- 导出字段筛选 -->
        <div class="card-title">请选择导出的字段名称</div>
        <div class="keysFilter">
          <el-input v-halfCharCode type="input" placeholder="搜索字段名称" v-model="searchVal" style="width: 300px;" />
          <el-button size="medium" type="primary" @click="searchVal = ''">重置</el-button>
        </div>
        <!-- 字段列表 -->
        <el-table :data="tableData" ref="exportTable" @selection-change="selectFields">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" type="index" width="100" align="center" />
          <el-table-column label="字段名称" prop="field" align="center" />
        </el-table>
      </div>
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="exportList">导 出</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import filterInput from '@/components/dataList/components/filterInput'
import { jsonSort } from '@/utils'
export default {
  name: "custom-export",
  components: {
    filterInput
  },
  props: {
    // 字段名称列表参数名称
    listName: {
      type: String,
      require: true
    },
    //导出字段列表
    exportData: {
      type: Array,
      default: () => []
    },
    // 筛选项列表
    filterList: {
      type: Array,
      default: () => []
    },
    // 导出数据参数
    exportParams: {
      type: Object,
      default: () => ({})
    },
    // 导出Api的url
    url: {
      type: String,
      require: true
    },
    // 导出excel的名称
    exportName: {
      type: String,
      default: ''
    },
    // 导出文件格式
    exportFormat: {
      type: String,
      default: 'xlsx'
    },
    // 弹窗宽度
    width: {
      type: String,
      default: '72%'
    }
  },
  data () {
    return {
      // 弹窗控制
      dialogVisible: false,
      // 字段名筛选
      searchVal: '',
      // 字段列表
      tableData: jsonSort(this.exportData, 'id'),
      // 选中的字段列表
      fields: [],
      // 筛选项表单项
      filterForm: {}
    }
  },
  watch: {
    searchVal (newValue, oldValue) {
      newValue !== oldValue && this.filter()
    }
  },
  methods: {
    // 筛选项改变监听
    handlePopInputChange (val, { name }) {
      this.filterForm[name] = val
    },
    //过滤列表
    filter () {
      let list = jsonSort(this.exportData, 'id');
      this.tableData = list.filter(item => item.field.indexOf(this.searchVal) > -1)
    },
    show () {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.tableData.forEach(item => {
          this.$refs.exportTable.toggleRowSelection(item, true)
        });
      })
    },
    // 字段列表选中监听
    selectFields (selectField) {
      this.fields = selectField
    },
    // 弹窗关闭
    closeDialog () {
      this.dialogVisible = false
    },
    // 导出
    async exportList () {
      if (!this.fields.length) {
        this.$message.error("请选择需要导出的字段")
      } else {
        const loading = this.$loading({
          lock: true,
          text: '数据处理中'
        });
        try {
          let params = { [this.listName]: this.fields, ...this.exportParams, ...this.filterForm }
          await this.publicExport(this.exportName, this.url, params, this.exportFormat, 'post')
          loading.close()
        } catch (error) {
          console.log(error)
          loading.close()
        }
      }
    }
  }
}

</script>

<style lang="scss">
.cCustomExport {
  .el-dialog__body {
    padding-top: 0px;
  }
  .filterList {
    display: flex;
    flex-wrap: wrap;
    margin-top: 12px;
    .inputItem {
      width: 31%;
      margin-right: 3%;
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
  .keysFilter {
    padding: 12px 0;
    display: flex;
    justify-content: space-between;
  }
}
</style>
