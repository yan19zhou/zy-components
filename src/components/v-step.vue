<template>
  <div class="cSteps">
    <slot name="title">
      <div class="card-title" v-if="title">{{title}}</div>
    </slot>
    <div class="top">
      <el-steps :active="milepostActive" align-center finish-status="success">
        <el-step v-for="(item, index) in milepost" :class="milepostActive === index+1 ? stepActive: ''" :title="item.title" :key="index" />
      </el-steps>
    </div>
    <div class="main">
      <div :class="`step_${index}`" v-for="(item, index) in milepost" :key="index">
        <slot :name="`step${index}`" v-if="milepostActive == index">
          <div class="addTemplate" v-if="index === 0">
            <div class="step-first">
              <div class="el-icon-upload one ones"></div>
              <div class="step-first-text">
                <h2>填写导入的信息</h2>
                <p>请按照收据模板的格式准备导入数据，模板中的表头名称不可更改， 表头行不能删除，单次导入的数据不超过1000条。</p>
                <el-button class="el-icon-download two" type="info" @click="handleDownTemplate">下载模板</el-button>
              </div>
            </div>
            <div class="step-first step-first-last">
              <div class="el-icon-upload one"></div>
              <div class="step-first-text">
                <h2>上传填好的数据模板</h2>
                <p>请按照收据模板的格式准备导入数据，模板中的表头名称不可更改， 表头行不能删除，单次导入的数据不超过1000条。</p>
                <el-upload class="upload-demo" ref="upload" action="/admin/sys-file/upLodeFileAdd" :auto-upload="false" :file-list="fileList" :on-change="handleChange">
                  <el-button class="el-icon-upload2 two" type="info">上传文件</el-button>
                </el-upload>
              </div>
            </div>
          </div>
          <div v-else>{{milepost[index].title}}</div>
        </slot>
      </div>
    </div>
    <div slot="foot" class="steps-btn">
      <el-button size="small" @click="goBack" v-if="milepostActive > 0">上一步</el-button>
      <el-button type="primary" size="small" @click="beforeNext" :loading="skipLoading">{{nextText}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'v-step',
  props: {
    // 数组对象
    milepost: {
      type: Array,
      default: () => [
        { title: '步骤一' },
        { title: '步骤二' },
        { title: '步骤三' },
      ]
    },
    // 动态添加类名
    stepActive: {
      type: String,
      default: 'stepActive'
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 模板地址
    templateUrl: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      // 默认步骤数
      milepostActive: 0,
      // 上传文件列表
      fileList: [],
      // loading
      skipLoading: false,
    }
  },
  computed: {
    nextText () {
      return this.milepostActive === this.milepost.length - 1 ? '完成' : '下一步'
    }
  },
  methods: {
    //上一步
    goBack () {
      this.milepostActive -= 1;
      this.$emit('prev', this.milepostActive)
    },
    async beforeNext () {
      if (this.milepost[this.milepostActive].validate && typeof this.milepost[this.milepostActive].validate == 'function') {
        this.skipLoading = true
        try {
          const validate = await this.milepost[this.milepostActive].validate()
          this.skipLoading = false;
          validate && this.next()
        } catch (error) {
          this.skipLoading = false;
        }
      } else {
        this.next()
      }
    },
    //下一步
    next () {
      this.milepostActive += 1;
      this.$emit('next', this.milepostActive)
    },
    // 下载模板
    handleDownTemplate () {
      if (this.templateUrl == '') {
        this.$message.warning('导入模板不存在，请联系管理员')
      } else {
        let beforeUrl = process.env.NODE_ENV == 'development' ? '' : process.env.BASE_URL
        window.location.href = `${window.location.origin}${beforeUrl}${this.templateUrl}`
      }
    },
    // 监听上传模板
    handleChange (file, fileList) {
      this.fileList = [file];
    }
  }
}
</script>

<style lang="scss">
.cSteps {
  background-color: #fff;
  height: 100%;
  /deep/.el-step.is-horizontal.stepActive {
    .el-step__head.is-finish {
      .el-step__line {
        // 当前步骤数横线样式设置
        .el-step__line-inner {
          width: 50% !important;
          border-width: 1px !important;
        }
      }
    }
  }
  // 步骤圆圈样式设置
  .el-step__icon.is-text {
    width: 50px;
    height: 50px;
  }
  //当前步骤圆圈样式设置
  .is-process {
    .el-step__icon.is-text {
      background-color: #2f54eb;
      border-color: #2f54eb;
      color: #fff;
    }
  }
  //步骤数横线样式设置
  .el-step.is-horizontal .el-step__line {
    top: 25px;
  }
  //步骤title样式设置
  .el-step__title {
    font-weight: 400;
    color: #6d7a81;
  }
  // 当前步骤title样式设置
  .el-step__title.is-finish {
    color: #283745;
  }
  // 完成后步骤样式设置
  .el-step__head.is-success {
    color: #2f54eb;
    border: #2f54eb;
  }
  .el-step__title.is-success {
    color: #2f54eb;
  }
  .top {
    padding: 40px 100px;
  }
  .main {
    text-align: center;
  }
  .steps-btn {
    width: 100%;
    margin-top: 24px;
    padding: 12px 24px;
    background-color: #fff;
    text-align: right;
    position: sticky;
    bottom: 0;
    z-index: 999;
  }
  .step-first {
    width: 100%;
    max-width: 1200px;
    height: 186px;
    box-sizing: border-box;
    border: 1px solid #eaeaea;
    margin: 20px auto 0px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .one {
      font-size: 90px;
      line-height: 180px;
      color: #666666;
    }
    .ones {
      transform: rotate(180deg);
    }
    .step-first-text {
      text-align: left;
      h2 {
        margin: 20px 0;
        color: #666666;
      }
      p {
        font-size: 16px;
        margin: 20px 0;
        color: #788394;
      }
      .two {
        background-color: #f4f4f4;
        color: #455a64;
      }
    }
  }
}
</style>
