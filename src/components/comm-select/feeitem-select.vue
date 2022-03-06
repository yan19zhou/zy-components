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
          <div class="left">费用项目选择</div>
          <div class="right pr20">
            <span class="el-icon-full-screen cursor" @click="fullscreen=!fullscreen"></span>
          </div>
        </div>
      </div>
      <div>
        <el-row>
          <el-col align="left" :span="24">
            <el-radio-group v-model="chargeProjectType" @change="queryData">
              <el-radio-button v-for="item in charge_project_type" :label="item.value" :key="item.value">{{item.label}}</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
          <div style="height: 10px"></div>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table ref="feeItemTable" :data="feeItemInfos" stripe style="width: 100%">
              <el-table-column width="80px" type="selection" />
              <el-table-column prop="chargeProjectType" label="费用项目类型" width="180">
                <template slot-scope="scope">
                  {{scope.row.chargeProjectType |
                  dict('charge_project_type')}}
                </template>
              </el-table-column>
              <el-table-column prop="chargeProjectName" label="费用项目名称" width="180" />
              <el-table-column prop="financeCode" label="对应财务系统代码" align="right" />
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
import { mapState } from 'vuex'
//费用项目选择
import { getFeeItem } from '@/views/wy-rent/api/rent-price'

export default {
  name: 'feeitem-select',
  props: {
    width: {
      type: String,
      default: '800px',
    },
  },

  data () {
    return {
      isOpen: false,
      fullscreen: false,

      chargeProjectType: null, //费用项目类型

      feeItemInfos: [], //费用项目列表
      selectedFeeItemInfos: [], //当前选择的费用项目列表，
    }
  },

  computed: {
    ...mapState({
      charge_project_type: (state) => {
        let data =
          state.dict.find((item) => item.type === 'charge_project_type') || {}
        let list = data.children || []
        return data.children || []
      },
    }),
  },

  methods: {
    show () {
      this.isOpen = true
    },

    queryData () {
      //查询物业,按项目或房间名，模糊查询
      //alert("暂无数据");
      //chargeProjectType
      getFeeItem(this.chargeProjectType)
        .then((response) => {
          //alert(JSON.stringify(response));
          if (response.data.code == 0) {
            this.feeItemInfos = response.data.data
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

    ok () {
      this.selectedFeeItemInfos = this.$refs.feeItemTable.selection
      //alert("选择好数据了"+JSON.stringify(selectData));
      this.$emit('completeSelect', this.selectedFeeItemInfos) //选择ok
      this.isOpen = false
    },
    close () {
      this.isOpen = false
    },
  },
}
</script>

<style lang="scss" >
@import "./scss/commonSelect";
</style>


