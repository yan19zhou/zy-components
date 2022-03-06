<!--
 * @Description: 
 * @Author: zhouy
 * @Date: 2021-08-16 17:54:17
 * @LastEditTime: 2021-10-08 18:00:12
 * @LastEditors: zhouy
-->
<template>
  <el-select :value="valueLocal" :clearable="clearable" @clear="clearHandle">
    <el-input class="selectInput" v-if="isFilter" :placeholder="placeholder" clearable v-model="filterText"> </el-input>
    <el-option :value="valueLocal" :label="valueLocal" class="options">
      <el-tree id="tree-option" ref="selectTree" :accordion="accordion" :load="loadNode" lazy :props="props" :node-key="props.value" :default-expanded-keys="defaultExpandedKey" :filter-node-method="filterNode" @node-click="handleNodeClick">
      </el-tree>
    </el-option>
  </el-select>
</template>

<script>
import { getDivision } from "@/admin/api/division";
export default {
  name: "el-tree-select",
  props: {
    /* 配置项,配置一下显示props  */
    props: {
      type: Object,
      default: () => {
        return {
          value: "divisionCode", // 字段码值
          label: "divisionName", // 显示名称
          children: "children", // 子级字段名
        };
      },
    },
    isFilter:{  // 后期有空可以加是否过滤，过滤方法已有 不懒加载的时候可以传入tree的data值
      type: Boolean,
      default:true
    },
    /* 初始值 */
    value: {
      type: Number | String,
      default: () => {
        return null;
      },
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    placeholder: {
      type: String,
      default: () => {
        return "检索关键字";
      },
    },
  },
  data() {
    return {
      filterText: "",
      valueId: this.value, // 初始值
      valueLocal: "",
      defaultExpandedKey: [],
    };
  },
  mounted() {
    this.initHandle();
  },
  methods: {
    async loadNode(node, resolve) {
      let data = [];
      const response = await getDivision({
        lazy: true,
        parentId: node?.data?.divisionCode || "000000",
      });
      data = response.data.data;
      if (node.data) {
        node.data.children = data;
      }
      resolve(data);
    },
    // 初始化值
    initHandle() {
      if (this.valueId) {
        this.valueLocal = this.$refs.selectTree?.getNode(this.valueId)?.data[this.props.label]||''; // 初始化显示
        this.$refs.selectTree?.setCurrentKey(this.valueId); // 设置默认选中
        this.defaultExpandedKey = [this.valueId]; // 设置默认展开
      }else{
        this.clearHandle();
      }
      this.initScroll();
    },
    // 初始化滚动条
    initScroll() {
      this.$nextTick(() => {
        let scrollWrap = document.querySelectorAll(".el-scrollbar .el-select-dropdown__wrap")[0];
        let scrollBar = document.querySelectorAll(".el-scrollbar .el-scrollbar__bar");
        scrollWrap.style.cssText = "margin: 0px; max-height: none; overflow: hidden;";
        scrollBar.forEach((ele) => (ele.style.width = 0));
      });
    },
    // 切换选项
    handleNodeClick(node) {
      this.valueLocal = node[this.props.label];
      this.valueId = node[this.props.value];
      this.$emit("input", this.valueId);
      this.defaultExpandedKey = [];
    },
    // 清除选中
    clearHandle() {
      this.valueLocal = "";
      this.valueId = null;
      this.defaultExpandedKey = [];
      this.clearSelected();
      this.$emit("input", "");
    },
    /* 清空选中样式 */
    clearSelected() {
      let allNode = document.querySelectorAll("#tree-option .el-tree-node");
      allNode.forEach((element) => element.classList.remove("is-current"));
    },
    filterNode(value, data) {
      if (!value) return true;
      return data[this.props.label].indexOf(value) !== -1;
    },
    clearBelongto() {
      this.belongto = "";
    }
  },
  watch: {
    value() {
      this.valueId = this.value;
      this.initHandle();
      
    },
    filterText(val) {
      this.$refs.selectTree.filter(val);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li >>> .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
.selectInput {
  padding: 0 5px;
  box-sizing: border-box;
}
</style>
