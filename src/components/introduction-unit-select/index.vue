<!--
 * @Author: xjt
 * @Date: 2021-03-25 09:29:15
 * @LastEditTime: 2021-03-25 10:51:59
 * @Description: 引进单位选择组件
-->
<template>
  <el-form-item :label="label" :prop="propName">
    <el-popover placement="bottom" width="400" trigger="click" v-model="delFlagVisible">
      <el-input v-halfCharCode placeholder="输入关键字进行过滤" v-model="filterText" />
      <el-tree class="filter-tree" :data="depts" :props="defaultProps" :filter-node-method="filterNode" :expand-on-click-node="false" @node-click="handleCheckChange" ref="tree" />
      <el-input
        :readonly="!canWrite"
        slot="reference"
        maxlength="30"
        :placeholder="placeholder"
        v-model="searchFrom.unitName"
        :suffix-icon="delFlagVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
        clearable
      />
    </el-popover>
  </el-form-item>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'introductionUnitSelect',
  props: {
    // 标题
    label: {
      type: String,
      default: '产业引进部门'
    },
    // 单位id
    unitId: {
      type: [Number, String],
      default: ''
    },
    // 单位名称对应的键名
    unitName: {
      type: String,
      default: ''
    },
    // 校验关键字
    propName: {
      type: String,
      default: 'introduceUnit'
    },
    // 能否手动输入
    canWrite: {
      type: Boolean,
      default: false
    },
    // 输入提示
    placeholder: {
      type: String,
      default: '请选择产业引进部门'
    }
  },
  data () {
    return {
      // 筛选关键字
      filterText: '',
      // 部门popover开关
      delFlagVisible: false,
      //搜索参数
      searchFrom: {
        unitName: '',
        id: ''
      },
    }
  },
  computed: {
    ...mapState(['depts']),
    // tree组件配置项
    defaultProps () {
      return {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    },
    unitId: {
      immediate: true,
      handler (val, oldVal) {
        this.searchFrom.id = val
      }
    },
    unitName: {
      immediate: true,
      handler (val, oldVal) {
        this.searchFrom.unitName = val
      },
    }
  },
  methods: {
    // 部门过滤
    filterNode (value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // tree组件点击
    handleCheckChange (data) {
      const { id, name } = data
      this.searchFrom = {
        id: id,
        unitName: name
      }
      this.$emit('update:unitId', id)
      this.$emit('update:unitName', name)
      this.delFlagVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
</style>