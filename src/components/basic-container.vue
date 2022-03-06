<template>
  <div :class="{'basic-container--block':block, 'tab': isTab}" class="basic-container">
    <div class="container-wrap">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'basicContainer',
  provide () {
    return {
      tableHeight: this.computedHeight
    }
  },
  props: {
    block: {
      type: Boolean,
      default: false
    },
    // 是否是tab切换的页面类型
    isTab: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    computedHeight () {
      let documentHeight = document.documentElement.clientHeight;
      let listWrap = document.querySelector(".el-table__body");
      let height = 0
      if (documentHeight && listWrap) {
        height = documentHeight - listWrap.getBoundingClientRect().top - 76
      }
      console.log(height)
      return height
    }
  },
}
</script>

<style lang="scss" >
.basic-container {
  padding: 24px;
  .container-wrap {
    background-color: white;
    padding: 16px 32px;
    border-radius: 4px;
    height: auto;
    overflow: hidden;
  }
  .el-card {
    width: 100%;
  }

  &:first-child {
    padding-top: 0;
  }

  &--block {
    height: 100%;

    .el-card {
      height: 100%;
    }
  }

  &.tab .container-wrap {
    .el-tabs {
      margin-top: 0px;
      .el-tabs__item {
        padding: 5px 24px;
        height: 50px;
      }
    }
    .dataList {
      padding-top: 0px;
    }
    padding-left: 0;
    padding-right: 0;
    padding-top: 0px;
  }

  //   /deep/ .operaColumn .el-button {
  //     color: var(--color);
  //   }
}
</style>
