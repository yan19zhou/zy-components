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
          <div class="left">出租方选择</div>
          <div class="right pr20">
            <span class="el-icon-full-screen cursor" @click="fullscreen=!fullscreen"></span>
          </div>
        </div>
      </div>
      <div>
        <el-row>
          <el-col align="left" :span="24">
            <el-input v-halfCharCode clearable style="width: 200px;padding: 5px" placeholder="请输入名称" v-model="lessorName" />
            <el-button type="primary" @click="queryData">查询</el-button>
            <el-button type="primary" @click="add" v-show="addLeaseShow">新增出租方</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" align="right">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="page.currentPage"
              :page-sizes="[10, 20, 50]"
              :page-size="5"
              background
              layout="total, prev, pager, next"
              :total="page.total"
            ></el-pagination>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table ref="lessorTable" :data="lessorInfos" stripe style="width: 100%">
              <el-table-column width="80px" type="selection" />
              <el-table-column prop="lessorName" label="出租方名称" width="180" />
              <el-table-column prop="lessorType" label="出租方类型" width="150">
                <template slot-scope="scope">{{scope.row.lessorType|dict('lessee_type')}}</template>
              </el-table-column>
              <el-table-column prop="certificateType" label="证件类型" width="150">
                <template slot-scope="scope">
                  <span v-if="scope.row.lessorType=='0'">{{scope.row.certificateType | dict('personage_certificate_type')}}</span>
                  <span v-if="scope.row.lessorType!='0'">{{scope.row.certificateType | dict('commercial_certificate_type')}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="certificateNum" label="证件号码" width="200" />
              <el-table-column prop="phoneNum" label="手机号码" width="120" />
              <el-table-column prop="address" label="详细地址" width="250" />
            </el-table>
          </el-col>
        </el-row>
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
import { fetchList } from '@/views/wy-lessor/landlord/api/lessor.js'

export default {
  name: 'lessor-select',
  props: {
    width: {
      type: String,
      default: '1000px',
    },
    //是否显示 新增出租房按钮 cqg+  2021/02/05 10:32
    addLeaseShow: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      isInit: true,

      lessorName: '',
      isOpen: false,
      fullscreen: false,
      lessorInfos: [], //物业列表
      selectedLessorInfos: [], //当前选择的物业列表，

      page: {
        currentPage: 1,
        pageSize: 5,
        total: 0,
      },
    }
  },

  methods: {
    show () {
      this.isOpen = true

      if (this.isInit) {
        this.isInit = false;
        this.queryData();
      }
    },

    handleCurrentChange (currentPage) {
      //alert(currentPage);
      this.page.currentPage = currentPage
      this.queryData()
    },

    queryData () {
      //查询物业,按项目或房间名，模糊查询
      //alert("暂无数据");
      fetchList(
        Object.assign(
          {
            current: this.page.currentPage,
            size: this.page.pageSize,
          },
          { lessorName: this.lessorName }
        )
      )
        .then((response) => {
          //alert(JSON.stringify(response));
          if (response.data.code == 0) {
            this.lessorInfos = response.data.data.records
            this.page.total = response.data.data.total
          } else {
            this.$alert(
              '服务器返回异常' + response.data.code + response.data.msg
            )
          }
        })
        .catch((reason) => {
          this.$alert('出错了' + reason)
        })
    },
    add () {
      this.$router.push({ path: '/wy-lessor/lessor-manage/add' })
    },

    ok () {
      this.selectedLessorInfos = this.$refs.lessorTable.selection
      //alert("选择好数据了"+JSON.stringify(selectData));
      this.$emit('completeSelect', this.selectedLessorInfos) //选择ok
      this.isOpen = false
    },
    close () {
      this.lessorName = '',  //解决关闭弹窗上次搜索记录还在的问题 cqg+
        this.isOpen = false
      this.isInit = true;

    },
  },
}
</script>

<style lang="scss" >
@import "./scss/commonSelect";
</style>


