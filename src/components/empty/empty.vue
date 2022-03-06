// 没有数据时的展示组件
<template>
  <div class="cEmpty">
    <i :class="`el-icon ${icon}`"/>
    <p>{{text}}</p>
  </div>
</template>

<script>
  export default {
    name: 'Empty',
    props: {
      // icon图标
      icon: {
        type: String,
        default: 'el-icon-receiving'
      },
      // 提示文本
      text: {
        type: String,
        default: '暂无数据'
      }
    }
  }
</script>

<style lang="scss" >
.cEmpty{
  text-align: center;
  .el-icon{
    font-size: 60px;
    color: #eee;
  }
  p{
    font-size: 15px;
    color: #ccc;
    margin-top: 8px;
  }
}
</style>