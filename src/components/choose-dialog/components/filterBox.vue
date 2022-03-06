<!--
 * @Author: cqg
 * @Date: 2020-12-24 11:37:31
 * @LastEditTime: 2021-09-07 16:42:32
 * @Description: file content
 * @LastEditors: zhouy
-->
<template>
  <div :class="`inputItem ${showAll ? 'small' : ''}`">
    <label class="label">{{label}}：</label>
    <el-button class="allBtn" size="mini" @click="clear" v-if="showAll">不限</el-button>
    <!-- <el-button class="allBtn" size="mini" @click="clear" v-if="showAll">重置</el-button> -->
    <!-- 文字输入框 -->
    <template v-if="inputType === 'input'">
      <el-input v-halfCharCode :placeholder="placeholder || '请输入内容'" maxlength="15" v-model="filterValue" clearable @clear="clear" />
    </template>
    <!-- 数字范围输入框 -->
    <template v-if="inputType === 'numberRange'">
      <el-form class="numberRange" ref="form" :model="filterValue" :rules="rules">
        <el-form-item prop="min">
          <el-input v-halfCharCode v-model="filterValue.min" @change="$refs.form.validateField('max')" clearable @clear="clear" />
        </el-form-item>
        <span class="inputBetween">至</span>
        <el-form-item prop="max">
          <el-input v-halfCharCode v-model="filterValue.max" @change="$refs.form.validateField('min')" clearable @clear="clear" />
        </el-form-item>
      </el-form>
    </template>
    <!-- 字典选择框 -->
    <template v-else-if="inputType === 'dict'">
      <el-select clearable style="width:60%;" :name="name" v-model="filterValue" :multiple="multiple" :placeholder="placeholder || '请选择'">
        <el-option v-for="item in filterList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </template>
    <!-- 自定义下拉框 -->
    <template v-else-if="inputType === 'select'">
      <el-select clearable v-model="filterValue" :multiple="multiple" :placeholder="placeholder || '请选择'">
        <el-option :label="item.label" :value="item.value" border v-for="item in children" :key="item.value" />
      </el-select>
    </template>
    <!-- 单选框 -->
    <template v-else-if="inputType === 'radio'">
      <el-radio-group v-model="filterValue">
        <el-radio :label="item.value" v-for="item in children" size="mini" border :key="item.value">{{item.label}}</el-radio>
      </el-radio-group>
    </template>
    <!-- 多选框 -->
    <template v-else-if="inputType === 'checkbox'">
      <el-checkbox-group v-model="filterValue">
        <el-checkbox :label="item.value" v-for="item in children" size="mini" border :key="item.value">{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </template>
    <!-- 日期区间 -->
    <template v-else-if="['date','datetime','daterange','datetimerange'].includes(inputType)">
      <el-date-picker v-model="filterValue" :type="inputType" :placeholder="placeholder || '请选择'" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" :value-format="inputFormat" @change="handleDatePickerChange" />
    </template>
  </div>
</template>

<script>
import { getDict } from '@/utils';
const MIN_NUMBER = 0;
const MAX_NUMBER = 9999999;

export default {
  name: "filterItem",
  props: {
    // 筛选项标题
    label: {
      type: String,
      required: true,
    },
    /**
     * 搜索参数对应的键名
     * 当inputType类型为区间时，可以填一个数组,分别放开始时间和结束时间的键名 => ['startTime','endTime']
     */
    name: {
      type: [String, Array],
      required: true,
      default: ''
    },
    /**
     * 筛选项类型(可根据实际情况扩展)
      input:文本搜索框;
      dict: 字典筛选(下拉框展示),
      radio: 单选框,
      checkbox: 多选框,
      select: 下拉框,
      date: 日期,
      daterange: 日期区间,
      datetime: 时间日期,
      datetimerange: 时间日期区间,
      numberRange: 数字区间
      */
    inputType: {
      type: String,
      default: 'input',
      validator (value) {
        return ['input', 'dict', 'radio', 'checkbox', 'select', 'date', 'datetime', 'daterange', 'datetimerange', 'numberRange'].includes(value)
      }
    },
    // 是否多选 [仅对type为dict或者select时生效]
    multiple: {
      type: Boolean,
      default: false
    },
    // 自定义筛选项的列表 参考 [{ label:'是', value:'1'}]
    children: {
      type: Array,
      default: () => []
    },
    // 字典名称
    dictName: {
      type: String,
      default: '',
    },
    // 输入提示语
    placeholder: {
      type: String,
      default: ''
    },
    // 不限按钮显示
    showAll: {
      type: Boolean,
      default: false
    },
    // 默认值
    value: {
    },
    // 是否需要支持v-model双向绑定
    binding: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      //筛选项对应的值
      filterValue: this.getDefaultValue(),
      form: { min: '', max: '' },
      // 数字区间校验
      rules: {
        min: [
          { validator: this.validateCom, trigger: 'blur' },
          { validator: this.validateMin, trigger: 'blur' },
        ],
        max: [
          { validator: this.validateCom, trigger: 'blur' },
          { validator: this.validateMax, trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    filterList () {
      if (this.inputType !== 'dict') return [];
      if (!this.dictName) {
        throw Error("筛选项类型为dict时，字典名称dictName不能为空")
      } else {
        return getDict(this.dictName)
      }
    },
    // 日期格式化
    inputFormat () {
      if (!['date', 'datetime', 'daterange', 'datetimerange'].includes(this.inputType)) return '';
      return ['date', 'daterange'].includes(this.inputType) ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'
    }
  },
  watch: {
    filterValue (val, oldVal) {
      this.binding && this.$emit("input", val)
    }
  },
  methods: {

    // 初始化filterValue
    getDefaultValue () {
      if (![undefined, ''].includes(this.value)) return this.value;
      if (this.multiple || this.inputType == 'checkbox') return [];
      if (this.inputType == 'numberRange') return { min: '', max: '' };
      return '';
    },
    // 清空
    clear () {
      if (this.multiple || this.inputType == 'checkbox') {
        this.filterValue = []
      } else if (this.inputType == 'numberRange') {
        this.filterValue = { min: '', max: '' }
      } else {
        this.filterValue = ''
      }
    },
    // 区间校验
    validateCom (rule, value, callback) {
      if (this.filterValue[0] == '' && this.filterValue[1] == '') return callback();
      const one = Number(value);
      if (Number.isInteger(one)) {
        if (one < MIN_NUMBER) {
          return callback(new Error('输入值必须大于0'));
        } else if (one > MAX_NUMBER) {
          return callback(new Error('输入值必须小于9999999'));
        }
        return callback();
      }
      return callback(new Error('输入值必须为正整数'));
    },
    // 最小值校验
    validateMin (rule, value, callback) {
      const one = Number(value);
      const max = Number(this.filterValue.max);
      if (!max || one < max) {
        return callback();
      }
      return callback(new Error('输入值不得大于最大值'));
    },
    // 最大值校验
    validateMax (rule, value, callback) {
      const one = Number(value);
      const min = Number(this.filterValue.min);
      if (!min || one > min) {
        return callback();
      }
      return callback(new Error('输入值不得小于最小值'));
    },
    // 获取数值区间信息
    getFormData () {
      const ret = {};
      this.$refs.form.validate((valid) => {
        ret.valid = valid;
        ret.form = this.filterValue;
      });
      return ret;
    },
    // 重置表单校验
    resetForm () {
      this.$refs.form.resetFields();
    },
    // 监听日期输入框
    handleDatePickerChange (val) {
      if (val == null) val = ''
    }
  },
}
</script>

<style lang="scss" >
.inputItem {
  display: flex;
  align-items: flex-start;
  min-height: 40px;
  .el-select,
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    // width: 79%;
  }
  &.small {
    & > .el-input {
      flex-grow: unset;
      width: 300px;
    }
    & > .el-select {
      flex-grow: unset;
      width: 300px;
    }
  }
  .label {
    margin-right: 20px;
    font-size: 14px;
    flex-shrink: 0;
    line-height: 40px;
  }
  & > .el-input {
    width: auto;
    flex-grow: 1;
    max-width: 80%;
  }
  & > .el-select {
    flex-grow: 1;
  }
  .allBtn {
    height: 28px;
    margin: 6px 20px 6px 0;
  }
  .el-radio.is-bordered,
  .el-checkbox.is-bordered {
    margin: 6px 10px 6px 0;
  }
  .el-checkbox.is-bordered + .el-checkbox.is-bordered,
  .el-radio.is-bordered + .el-radio.is-bordered {
    margin-left: 0;
  }

  .inputBetween {
    line-height: 40px;
    display: inline-block;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  .numberRange {
    width: 100%;
    display: flex;
    .el-input {
      width: 100%;
    }
    .inputBetween {
      flex-shrink: 0;
      margin: 0 10px;
    }
  }
}
</style>
