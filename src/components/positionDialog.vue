
// 地图坐标选择弹窗
<template>
  <el-dialog
    title="地图坐标选择"
    width="80%"
    :visible.sync="positionVisible"
    custom-class="positionDialog"
    :close-on-click-modal="false"
    @close="handleClose"
    append-to-body
  >
    <iframe class="iframe" width="100%" height="620px" :src="positionUrl" frameborder="0"></iframe>
  </el-dialog>
</template>

<script>
export default {
  name: 'positionDialog',
  props: {
    // 经纬度坐标
    position: {
      type: String,
    },
    // 围栏坐标
    pen: {
      type: [Array, String]
    }
  },
  data () {
    return {
      // 弹窗控制器
      positionVisible: false,
      // 是否预览
      preview: false,
      // 当前场景
      scene: ''
    }
  },
  computed: {
    // 定位页面地址
    positionUrl () {
      let positionPort = this.getDict('position_port')
      let origin = window.location.origin.replace(/:\d{4}$/, '')
      if (this.preview) {
        if (!this.position || this.position.indexOf(',') < 0) return new Error('经纬度坐标错误')
        if (positionPort[0]?.value == '8081') {
          return `http://192.168.101.179:9080/map/poiLocation.html?location=${this.position}`
        } else {
          if (this.scene == 'pen-preview') {
            return `${origin}:${positionPort[0]?.value || 8081}/map/enclosureLocation.html?location=${this.pen}`
          } else {
            return `${origin}:${positionPort[0]?.value || 8081}/map/poiLocation.html?location=${this.position}`
          }
        }
      } else {
        if (positionPort[0]?.value == '8081') {
          return `${origin}:${positionPort[0]?.value || 8081}/poi/index.html`
        } else {
          if (this.scene == 'pen') {
            return `${origin}:${positionPort[0]?.value || 9080}/map/enclosure.html`
          } else {
            return `${origin}:${positionPort[0]?.value || 9080}/map/poiSearch.html`
          }

        }
      }
      //return 'http://127.0.0.1:8848/poi/index.html'
    }
  },
  mounted () {
    window.addEventListener('message', this.handlePostMessage, false);
  },
  beforeDestroy () {
    window.removeEventListener('message', this.handlePostMessage, false);
  },
  methods: {
    show (type = 'choose') {
      this.scene = type
      switch (type) {
        case 'pen': // 围栏坐标选择
          this.positionVisible = true
          break;
        case 'choose': //定位坐标选择
          this.positionVisible = true
          break;
        case 'preview': //定位坐标预览
          if (!this.position || this.position.indexOf(',') < 0) {
            this.$message.warning('地图坐标错误')
          } else {
            this.preview = true
            this.$nextTick(() => (this.positionVisible = true))
          }
          break;
        case 'pen-preview': // 围栏坐标预览
          if (!this.pen) {
            this.$message.warning('地图围栏坐标错误')
          } else {
            this.preview = true
            this.$nextTick(() => (this.positionVisible = true))
          }
          break;
        default:
          break;
      }
    },
    // 监听iframe页面
    handlePostMessage (event) {
      if (!this.positionVisible) return;
      console.log(event.data)
      this.$emit('changeMessage', event.data)
      this.positionVisible = false
    },
    handleClose () {
      this.preview = false
    }
  }
}
</script>

<style lang="scss" >
.positionDialog {
  .iframe {
    display: block;
  }
}
</style>