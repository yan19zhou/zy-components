<!--
 * @Author: xjt
 * @Date: 2021-03-29 09:39:35
 * @LastEditTime: 2021-04-16 16:08:48
 * @Description: 日期输入框【支持文本输入和日期选择】
 * @LastEditors: xjt
-->
<template>
  <div class="cDatepicker">
    <el-input class="cInput" :placeholder="placeholder" v-model="customValue">
      <el-button size="small" slot="append" @click="openDialog">{{btnText}}</el-button>
    </el-input>
    <el-date-picker
      ref="datepicker"
      maxlength="30"
      :value-format="valueFormat"
      :format="format"
      v-model="customDate"
      type="date"
      @change="handleDateChange"
    />
  </div>
</template>

<script>
export default {
  name: 'datepicker',
  props: {
    // 输入框提示语
    placeholder: {
      type: String,
      default: '请输入'
    },
    // 触发按钮名称
    btnText: {
      type: String,
      default: '选择日期'
    },
    // 输出格式化
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    // 显示格式化
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 自定义输入值
      customValue: '',
      // 日期
      customDate: ''
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.customValue = val
      }
    },
    customValue (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    // 开启日期选择
    openDialog () {
      this.customValue = ''
      this.$refs.datepicker.focus()
    },
    // 日期改变监听
    handleDateChange (val) {
      this.customValue = val
    }
  },
}
</script>

<style lang="scss" >
.cDatepicker {
  position: relative;
  .cInput {
    position: relative;
    z-index: 2;
  }
  .el-date-editor {
    position: absolute;
    top: 0;
    left: 0;
    //pointer-events: none;
    .el-input__inner {
      //visibility: hidden;
    }
  }
}
</style>
