// 合同查看弹窗合同pdf预览模块
<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>合同预览</span>
    </div>
    <div class="text item">
      <div class="pdf">
        <div @click="dialogContractVisible = true">
          <pdf :src="pdfUrl" :page="1" v-if="pdfUrl" />
          <empty text="暂无可预览合同" icon=" el-icon-tickets" v-else />
        </div>
        <br />
        <span>{{contractName}}</span>
        <!--弹出合同详细内容-->
        <el-dialog title="合同详情" :visible.sync="dialogContractVisible" width="80%" append-to-body>
          <el-row>
            <pdf :src="pdfUrl" :page="pageNum" @num-pages="pageTotalNum=$event" @link-clicked="page = $event" />
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-row style="text-align: center;">
              <h3>
                <span>{{pageNum}}/{{pageTotalNum}}</span>
              </h3>
            </el-row>
            <el-row style="text-align: center;">
              <el-button type="primary" @click.stop="prePage">上一张</el-button>
              <el-button type="primary" @click="dialogContractVisible = false">浏览完毕</el-button>
              <el-button type="primary" @click.stop="nextPage">下一张</el-button>
            </el-row>
          </span>
        </el-dialog>
      </div>
    </div>
  </el-card>
</template>

<script>
import pdf from "vue-pdf";
export default {
  name: 'contractPreview',
  components: {
    pdf
  },
  props: {
    // pdf地址
    pdfUrl: {
      type: String,
      default: ''
    },
    // 合同名称
    contractName: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      pageNum: 1,
      category: 1,
      pageTotalNum: "",
      dialogContractVisible: false,
    }
  },
  methods: {
    //合同预览
    //上一页
    prePage () {
      var p = this.pageNum;
      p = p > 1 ? p - 1 : this.pageTotalNum;
      this.pageNum = p;
    },
    //下一页
    nextPage () {
      var p = this.pageNum;
      p = p < this.pageTotalNum ? p + 1 : 1;
      this.pageNum = p;
    },
  },
}
</script>