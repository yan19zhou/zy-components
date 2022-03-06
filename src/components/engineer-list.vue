// Created by lifei on 2020/7/20--9:24.
<template>
  <div>
    <v-dialog :title="'选择' + config.title" :show.sync="dialogVisible" @beforeClose="beforeClose" width="1200px">
      <list-page
        class="box-shadow"
        :pager="pager"
        :data="tableData"
        :showSelectSearch="false"
        :showSelectTips="false"
        @searchByKey="searchByKey"
        @changePageSize="changePageSize"
        @changeCurrentPage="changeCurrentPage"
        :placeholder="'请输入' + config.title"
      >
        <template slot="table">
          <el-table :data="tableData" align="center" v-loading="tableLoading">
            <el-table-column v-for="item in config.tableColumn" :key="item.model" :label="item.label" :prop="item.model"></el-table-column>

            <el-table-column width="120px" label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="chooseData(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </list-page>
      <div slot="foot" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import pager from '@/assets/vue-mixin/pager'

export default {
  name: 'resource-manage',
  mixins: [pager],
  props: {
    propertyPageList: {
      type: Function,
      default: () => {
      }
    },
    config: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      dialogVisible: false,
      tableData: [],
      searchForm: {},
    }
  },
  methods: {
    show () {
      this.dialogVisible = true
    },
    getListData () {
      this.propertyPageList(Object.assign({}, this.pageParams, this.searchForm)).then(resp => {
        this.setListData(resp.data)
      })
    },
    chooseData (item) {
      this.dialogVisible = false
      this.$emit('chooseData', item)
    },
    searchByKey (val) {
      if (val) {
        this.searchForm.propertyName = val
      } else {
        delete this.searchForm.propertyName
      }
      this.resetList()
    },
    //hxf-0803- 弹框X关闭事件
    beforeClose (done) {
      done()
    }
  }
}

</script>
