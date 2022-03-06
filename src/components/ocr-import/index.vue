<template>
  <basic-container class="ocrPage">
    <v-step ref="steps" :milepost="milepost" templateUrl="/propertypriceImport.xls">
      <div class="formWrap" slot="step0">
        <ocrUpload ref="ocrUpload" />
      </div>
      <div class="formWrap" slot="step1">
        <ocrPreview :ocrData="scanData" />
        <slot v-if="showForm" />
      </div>

      <div class="formWrap" slot="step2">
        <slot name="step2" />
      </div>

      <div class="formWrap" slot="step3">
        <slot name="step3" />
      </div>

      <div class="formWrap" slot="step4">
        <slot name="step4" />
      </div>
    </v-step>
  </basic-container>
</template>

<script>
import ocrUpload from './components/ocrUpload'
import ocrPreview from './components/ocrPreview'
export default {
  name: 'ocrImport',
  props: {
    // ocr类型
    type: {
      type: String,
      default: ''
    },
    // 步骤列表
    steps: {
      type: Array,
      default: () => []
    },
    // 识别完成自动跳转下一步
    autoNext: {
      type: Boolean,
      default: true
    }
  },
  components: { ocrUpload, ocrPreview },
  data () {
    return {
      // ocr扫描识别信息
      scanData: {},
      // 显示表单项
      showForm: false
    }
  },
  computed: {
    // ocr识别上传类型
    paperType () {
      return this.getDict('paper_type')
    },
    // 里程碑列表
    milepost () {
      return this.steps.map((item, index) => {
        if (index === 0) {
          return { ...item, validate: this.handleOcrUpload }
        } else {
          return item
        }
      })
    },
  },
  methods: {
    // 步骤1：ocr扫描
    handleOcrUpload () {
      let files = this.$refs.ocrUpload.getFiles();
      const loading = this.$loading({
        lock: true,
        text: '文件上传中...',
        spinner: 'el-icon-loading',
      });
      try {
        let formData = new FormData();
        files.forEach(file => {
          formData.append('file', file.raw)
        })
        formData.append('type', this.type)
        this.http.post('/ocr-api/ocr/pdf-scan', formData).then(resp => {
          let [previewData, requestData] = resp.data
          this.scanData = previewData
          this.showForm = true
          this.$emit('scanCompleted', { data: requestData, files })
          this.autoNext && this.$refs.steps.next()
        }).finally(() => {
          loading.close()
        })
      } catch (e) {
        console.error(e)
        loading.close()
      }
    },
    // 跳转下一步
    next () {
      this.$refs.steps.next()
    },
  },
}
</script>

<style lang="scss" scoped>
.ocrPage {
  /deep/ .container-wrap {
    min-height: 100%;
  }
  text-align: left;
  /deep/ .card-box {
    text-align: left;
  }
}
</style>