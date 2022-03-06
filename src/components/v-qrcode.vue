<!--
 * @Author: xjt
 * @Date: 2021-06-26 08:43:59
 * @LastEditTime: 2021-06-26 15:11:54
 * @Description: 二维码生成弹框
 * @LastEditors: cqg
-->
<template>
  <el-dialog custom-class="qrcodeDialog" :title="title" :visible.sync="dialogVisible" width="30%" :closed="handleDialogClose">
    <div class="qrcodeWrap">
      <p class="qrcodeHead" v-if="headText">{{headText}}</p>
      <vue-qr :text="qrcodeInfo" :size="size" />
      <p class="qrcodeFoot" v-if="footText">{{footText}}</p>
      <slot />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import vueQr from 'vue-qr'
export default {
  name: 'vQrcode',
  components: {
    vueQr
  },
  props: {
    // 弹框标题
    title: {
      type: String,
      default: '二维码'
    },
    // 二维码尺寸【px】
    size: {
      type: Number,
      default: 250
    }
  },
  data () {
    return {
      dialogVisible: false,
      // 二维码文本信息
      qrcodeInfo: '',
      // 二维码上面文本信息
      headText: '',
      // 二维码下面文本信息
      footText: '',
    }
  },
  methods: {
    /**
     * 弹窗显示事件
     * val {String|Object} 生成二维码文本内容
     * example1: this.$refs.qrcode.show('http://www.baidu.com')
     * example2: this.$refs.qrcode.show({headText:'头部文字',footText:'底部文字',text:'二维码文本信息'})
     */
    show (data) {
      if (typeof data === 'string') {
        if (!data) return this.$message.error('二维码信息不能为空')
        this.qrcodeInfo = data
        this.$nextTick(() => {
          this.dialogVisible = true
        })
      } else if (Object.prototype.toString.call(data) === "[object Object]") {
        let { headText = '', footText = '', text = '' } = data
        if (!text) return this.$message.error('二维码信息不能为空')
        this.headText = headText
        this.footText = footText
        this.qrcodeInfo = text
        this.$nextTick(() => {
          this.dialogVisible = true
        })
      }
    },
    // 弹窗关闭监听
    handleDialogClose () {
      this.qrcodeInfo = ''
      this.headText = ''
      this.footText = ''
    }
  }
}
</script>

<style lang="scss">
.qrcodeDialog {
  .el-dialog__body {
    padding: 0 20px;
  }
  .qrcodeWrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .qrcodeHead {
    font-size: 16px;
    color: #333;
  }
}
</style>
