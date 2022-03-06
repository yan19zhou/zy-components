// Created by lifei on 2020/6/11--11:33.
<template>
  <div class="v-dialog">
    <el-dialog
      :visible.sync="isOpen"
      :width="width"
      :top="top"
      :fullscreen="fullscreen"
      @close="close"
      :append-to-body="appendToBody"
      :close-on-click-modal="closeOnClickModal"
      :before-close="beforeClose"
      :modal="modal"
      :custom-class="`${!fullscreen ? 'dialog-fullscreen': 'my-dialog-class'} ${smallPadding && 'small-padding-dialog'}`"
      :destroy-on-close="true"
      :modal-append-to-body="modalAppendToBody"
    >
      <div slot="title">
        <div class="flex-bc mr20 dialog-title">
          <div class="left">{{title}}</div>
          <div class="right pr20">
            <span class="el-icon-full-screen cursor" @click="fullscreen=!fullscreen"></span>
          </div>
        </div>
      </div>
      <slot></slot>
      <div slot="footer">
        <slot name="foot"></slot>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'v-dialog',
  props: {
    show: {
      type: Boolean,
      default: () => true
    },
    title: {
      type: String,
      default: '标题'
    },
    top: {
      type: String,
      default: '8vh'
    },
    width: {
      type: String,
      default: '800px'
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    modal: {
      type: Boolean,
      default: true
    },
    // 关闭前的回调函数
    beforeCut: {
      type: Function,
      default: () => true
    },
    // 减少边距
    smallPadding: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fullscreen: false,
      isOpen: false
    }
  },
  mounted () {
    if (this.show) {
      this.isOpen = true
    }
  },
  methods: {
    close () {
      this.$emit('update:show', false)
    },
    beforeClose (done) {
      this.$emit('beforeClose', done);
      this.beforeCut() && done()
    },
  },
  watch: {
    show () {
      this.isOpen = this.show
    }
  }

}
</script>

<style lang="scss" scoped>
.dialog-title {
  position: relative;
  top: -1px;

  .left {
    font-size: 18px;
  }

  .right {
    padding: 4px;
    position: relative;
    top: -2px;
  }
}
.el-loading-mask {
  z-index: 1999 !important;
}
.v-dialog {
  /deep/ .el-dialog__body {
    padding: 16px 32px;
  }
}
</style>
