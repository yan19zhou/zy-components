<!--
 * @Description: 
 * @Author: zhouy
 * @Date: 2021-08-18 16:32:55
 * @LastEditTime: 2021-08-19 15:03:16
 * @LastEditors: zhouy
-->
<template>
  <div class="pager-box" :class="{flexRight: hideSelectTips}">
    <div class="tips" v-if="!hideSelectTips">
      已选中
      <span>{{ selectData.length }}</span> 条
    </div>
    <div class="pager">
      <el-pagination
        @size-change="changePageSize"
        @current-change="changeCurrentPage"
        :current-page.sync="currentPage"
        :layout="layout"
        :page-sizes="pageSizes"
        :page-size="pageInfo.size"
        :total="pageInfo.total"
        background
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "pager",
  props: {
    hideSelectTips: {
      type: Boolean,
      default: false
    },
    pageInfo: {
      type: Object,
    },
    selectData: {
      type: Array,
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100,200,500,1000]
    },
    layout: {
      type: String,
      default: 'total, prev, pager, next, sizes'
    }
  },
  data () {
    return {
      currentPage: 1,
    };
  },
  watch: {
    pageInfo: {
      deep: true,
      immediate: true,
      handler (val) {
        this.currentPage = val.current
      }
    }
  },
  methods: {
    changePageSize (val) {
      this.$emit("changePageSize", val);
    },
    changeCurrentPage (val) {
      this.$emit("changeCurrentPage", val);
    },
  },
};
</script>

<style scoped lang='scss'>
.pager-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  &.flexRight {
    justify-content: flex-end;
  }
  .tips {
    color: #999;
    span {
      color: #409eff;
    }
  }
  .pager {
    margin-right: -20px;
  }
}
</style>
