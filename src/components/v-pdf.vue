<template>
  <div class="cPdf">
    <div class="cMenu">
      <el-button @click.stop="prePage"
                 :disabled="pageNum == 1">上一页</el-button>
      <div class="cPage"><span>当前页码：</span> {{pageNum}}/{{pageTotalNum}}</div>
      <el-button @click.stop="nextPage"
                 :disabled="pageNum == pageTotalNum">下一页</el-button>
      <el-button class="cPrint"
                 v-if="isPrint"
                 type="primary"
                 @click.stop="pdfPrintAll">全部打印</el-button>
    </div>
    <div class="cPdfBox"
         v-scrollBar>
      <pdf ref="pdf"
           :src="url"
           :page="pageNum"
           :rotate="pageRotate"
           @progress="loadedRatio = $event"
           @page-loaded="pageLoaded($event)"
           @num-pages="pageTotalNum=$event"
           @error="pdfError($event)"
           @link-clicked="page = $event" />
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import BaseLoad from '@/assets/vue-mixin/BaseLoad'
import { download } from '~/admin/api/common'
export default {
  name: 'v-pdf',
  mixins: [BaseLoad],
  components: {
    pdf,
  },
  props: {
    // 文件资源id
    fileId: {
      type: String,
      default: '',
    },
    // pdf地址
    src: {
      type: String,
      default: '',
    },
    // 是否可
    isPrint: {
      type: Boolean,
      default: false,
    },
    requestUrl: {
      type: String,
      default: '/admin/sys-file/download/'
    }
  },
  data() {
    return {
      url: '',
      pageNum: 1,
      pageTotalNum: 1,
      pageRotate: 0,
      // 加载进度
      loadedRatio: 0,
      curPageNum: 0,
    }
  },
  mounted() {
    // 有src的话优先使用src，没有src的话通过fileId获取临时src
    this.src ? (this.url = this.src) : this.init()
  },

  methods: {
    // 获取pdf的blob并获取内存地址
    async init() {
      if (!this.fileId) return
      download(this.requestUrl + this.fileId, null).then(
        (response) => {
                     //处理pdfUrl返回
         let url =  pdf.createLoadingTask({
               url: window.URL.createObjectURL(response.data),
               //引入pdf.js字体，templ
               cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.5.207/cmaps/',
               cMapPacked: true
             })
          this.url = url
        }
      )
    },
    // 上一页
    prePage() {
      let page = this.pageNum
      page = page > 1 ? page - 1 : this.pageTotalNum
      this.pageNum = page
    },
    // 下一页
    nextPage() {
      let page = this.pageNum
      page = page < this.pageTotalNum ? page + 1 : 1
      this.pageNum = page
    },
    // 顺时针旋转
    clock() {
      this.pageRotate += 90
    },
    // 逆时针旋转
    counterClock() {
      this.pageRotate -= 90
    },
    // 某页面加载成功回调
    pageLoaded(e) {
      // this.loadClose()
      this.curPageNum = e
    },
    // pdf加载失败
    pdfError(error) {
      // this.loadClose()
      console.error(error)
      this.err('pdf加载失败！')
    },
    // pdf打印
    pdfPrintAll() {
      this.$refs.pdf.print()
    },
  },
}
</script>

<style lang="scss" >
.cPdf {
  max-height: 100%;
  display: flex;
  flex-direction: column;
  .cMenu {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    position: relative;
    flex-shrink: 0;
    .cPage {
      margin: 0 20px;
    }
    .cPrint {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .cPdfBox {
    flex-grow: 1;
  }
}
</style>
