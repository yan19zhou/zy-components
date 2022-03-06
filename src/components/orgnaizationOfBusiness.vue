<!--
 * @Author: cqg
 * @Date: 2021-09-14 10:44:44
 * @LastEditTime: 2021-09-26 15:38:04
 * @Description: 业务经办公共组件
 * @LastEditors: cqg
-->
<template>
  <div class="main">
    <div class="title " :style="{backgroundColor:titleBgc,fontSize:titleFsz}" v-show="showTitle">业务经办</div>
    <div class="content">
      <el-row v-if="!isAdd">
        <el-col :span="8">上次更新经办人：{{formData.modipers}}</el-col>
        <el-col :span="8">上次更新时间：{{formData.moditime}}</el-col>
      </el-row>
      <el-row v-if="!isAdd">
        <el-col :span="8">创建人：{{formData.creapers}}</el-col>
        <el-col :span="8">创建时间：{{formData.creatime}}</el-col>
      </el-row>
      <el-row class="handler">
        <el-col :span="showTitle?8:4" :offset="showTitle?0:16" >
          <span class="weight">经办人：</span>
          {{this.user.realName}}
        </el-col>
        <el-col :span="showTitle?8:4">
          <span class="weight">经办时间：</span>
          {{handlingTime}}
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
export default {
  props: {
    // 当前回显数据对象
    formData: {
      type: Object,
      default: () => {
        return {
          modipers:'',
          moditime:'',
          creapers:'',
          creatime:'',
        }
       }
    },
    //是否是新增（用来显隐字段）
    isAdd: {
      type: Boolean,
      default: false
    },
    //是否显示标题栏
    showTitle:{
      type:Boolean,
      default:true
    },
    //标题背景颜色
    titleBgc:{
      type:String,
      default:'#cce1f1'
    },
    //标题背景颜色
    titleFsz:{
      type:String,
      default:'12px'
    },
  },
  computed: {
    ...mapState({
      user: (state) => state.user.user,
    }),
    handlingTime () {
      return moment().format("YYYY-MM-DD HH:mm:ss")
    }
  },
}
</script>

<style lang="scss" scoped>
/deep/.el-row{
  height:30px;
  line-height: 30px;
}
.main {
  text-align: left;
  width: 100%;
  .title {
    padding: 10px;
    border-radius: 5px;
    opacity: 0.9;
    color: blue;
    margin-bottom: 20px;
  }
  .weight {
    font-weight: 700;
  }
  .handler{
    font-weight: bold;
  }
}
</style>