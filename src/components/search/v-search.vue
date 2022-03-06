<!--
 * @Description: 
 * @Author: zhouy
 * @Date: 2021-09-07 16:46:17
 * @LastEditTime: 2021-09-26 17:06:04
 * @LastEditors: zhouy
-->
<template>
  <!-- 列表筛选  -->
  <div class="`listFilter">
    <!-- 选中的筛选 -->
    <div class="chooseFilter" v-if="filterList.length">
      <el-row class="search-row" v-if="!showMore">
        <el-col :span="24">
          <el-row :gutter="48">
            <el-col :span="item.filterSpan || 6" v-for="(item, index) in filterData.filter((v) => v.hasOwnProperty('defaultValue'))" :key="index">
              <filterInput v-show="!item.hidden" :key="item.filterName + index" v-bind="item" :minLevel="item.minLevel" :ref="item.name" :children="item.isLink ? linkFilterOptions[item.name] : item.children || []" binding v-model="item.value" />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <transition name="el-zoom-in-top">
        <div v-show="showMore">
          <el-row v-for="(group, index) in groups" :key="group + index" class="search-row" type="flex">
            <el-col :span="filterSpan" class="search-title">
              {{ group }}
            </el-col>
            <el-col :span="24 - filterSpan">
              <el-row :gutter="48">
                <el-col :span="item.filterSpan || 6" v-for="(item, index) in filterData.filter((v) => v.group === group)" :key="index" :class="item.hasOwnProperty('defaultValue') ? 'common_use' : ''">
                  <filterInput v-show="!item.hidden" :key="item.filterName + index" :ref="item.name" :minLevel="item.minLevel" v-bind="item" :children="item.isLink ? linkFilterOptions[item.name] : item.children || []" binding v-model="item.value" />
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="search-row" v-if="this.noGroupList.length">
            <el-col :span="24">
              <el-row :gutter="48">
                <el-col :span="item.filterSpan || 6" v-for="(item, index) in filterData.filter((v) => this.noGroupList.includes(v.label))" :key="index">
                  <filterInput v-show="!item.hidden" :key="item.filterName + index" :ref="item.name" v-bind="item" :children="item.isLink ? linkFilterOptions[item.name] : item.children || []" binding v-model="item.value" />
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </transition>
      <el-row :gutter="72">
        <el-col :span="8" style="height:1px"></el-col>
        <el-col :span="8" class="center-col">
          <el-button type="text" @click="showMore = !showMore" v-show="!hideFilterBtn">
            高级查询
            <i :class="['el-icon--right', showMore ? 'el-icon-arrow-down' : 'el-icon-arrow-up']" />
          </el-button>
          <slot name="searchbtn"></slot>
        </el-col>
        <el-col :span="8" class="last-col">
          <el-button type="primary" size="small" @click="handleFilter">查询</el-button>
          <el-button type="default" size="small" @click="resetFilter">重置</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import filterInput from "./filterInput.vue";
import objMap from "./objMap";
export default {
  components: {
    filterInput,
  },
  props: {
    /* 
    传参和dataList中的传参基本一致
    新增参数:
    isJoin:多选时是否需要拼接字符串
    group:所属分组
    例：    
    {
      label: "人员类型",
      inputType: "dict",
      name: "personClassify",
      dictName: "person_classify",
      multiple: true,
      isJoin:true,
      group: "基础信息",
    },

    */
    filterList: {
      type: Array,
      default: () => [],
    },
    filterSpan: {
      type: Number | String,
      default: 2,
    },
    // 是否隐藏更多筛选按钮
    hideFilterBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 高级筛选
      showMore: false,
      filterData: [],
      foldList: [], //折叠的数据
      groups: [],
      noGroupList: [], //列表数据无分组的情况
      params: {},
    };
  },
  methods: {
    handleFilter() {
      let obj = {};
      this.filterData.forEach((v) => {
        if (v.value !== undefined) {
          // 筛选项日期区间处理
          if (["datetimerange", "daterange"].includes(v.inputType) && Array.isArray(v.name)) {
            const [startName, endName] = v.name;
            const [startTime, endTime] = v.value || [];
            obj[startName] = startTime || "";
            obj[endName] = endTime || "";
          } else if (["numberRange"].includes(v.inputType) && Array.isArray(v.name) && v.value) {
            const [startName, endName] = v.name;
            const { min, max } = v.value;
            obj[startName] = min;
            obj[endName] = max;
          } else if (v.multiple && v.isJoin) {
            obj[v.name] = v.value.join(",");
          } else if (v.inputType == "cascader") {
            obj[v.name] = "";
            if (v.value) {
              obj[objMap[v.name][v.value.level]] = v.value.value;
            } else {
              for (const key in objMap[v.name]) {
                if (Object.hasOwnProperty.call(objMap[v.name], key)) {
                  let ele =objMap[v.name][key]
                  obj[ele] = "";
                }
              }
            }
          } else {
            obj[v.name] = v.value;
          }
        }
      });

      this.$emit("filter", obj);
      console.log("--handleFilter---", obj);
    },
    resetFilter() {
      let formData = {};
      this.filterData.forEach((item, index) => {
        if (!this.$refs[`${item.name}`]) return;
        let ref = this.$refs[`${item.name}`][0];
        ref.clear();
        if (["datetimerange", "daterange", "numberRange"].includes(ref.inputType) && Array.isArray(ref.name)) {
          const [startName, endName] = ref.name;
          formData[startName] = "";
          formData[endName] = "";
        } else if (ref.inputType == "cascader") {
          formData[item.name] = "";
            for (const key in objMap[item.name]) {
                if (Object.hasOwnProperty.call(objMap[item.name], key)) {
                  let ele =objMap[item.name][key]
                  formData[ele] = "";
                }
              }
        } else {
          formData[ref.name] = ref.multiple || ref.inputType == "checkbox" ? [] : "";
          ref.multiple && item.isJoin && (formData[ref.name] = "");
        }
      });
      console.log("======resetFilter========", formData);
      this.$emit("filter", formData);
    },
  },
  watch: {
    filterList: {
      handler(val) {
        if (val) {
          this.groups = [];
          this.noGroupList = [];
          val.map((v, i) => {
            this.filterData[i] = v;
            if (v.defaultValue) {
              this.filterData[i].value = v.defaultValue;
            }
            if (v.group) {
              if (!this.groups.includes(v.group)) {
                this.groups.push(v.group);
              }
            } else {
              this.noGroupList.push(v.label);
            }
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.search-row {
  padding-top: 16px;
  margin-bottom: 16px;
  margin-left: 0 !important;
  margin-right: 0 !important;
  border-top: solid 1px #eaeefd;
  .search-title {
    font-weight: bold;
  }
}
.common_use {
  // color: red;
}
.center-col {
  text-align: center;
}
.el-col {
  min-height: 1px;
}
.last-col {
  text-align: right;
}
</style>
