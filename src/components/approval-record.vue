<!--
 * @Author: cqg 
 * @Date: 2020-11-11 10:43:14
 * @LastEditors: xjt
 * @LastEditTime: 2021-06-15 17:47:56
 * @Description: 审批记录列表组件
-->
<template>
  <div class="cApprovalRecord">
    <div class="c_l info">
      <p>办理人：{{ approvalPerson }}</p>
      <p>办理环节：{{ step }} 办理结果：{{approvalResult | dict('approval_result') }}</p>
      <p>办理意见：{{ opinion }}</p>
      <p>办理时间：{{ operateTime }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'approval-record',
  props: {
    //用户名称
    approvalPerson: {
      type: String,
      default: '',
    },
    //用户名称
    approvalResult: {
      type: String,
      default: '',
    },
    step: {
      type: String,
      default: '',
    },
    opinion: {
      type: String,
      default: '',
    },
    operateTime: {
      type: String,
      default: '',
    },
  },
}
</script>
<style lang="scss" >
.cApprovalRecord {
  width: 100%;
  border-bottom: 1px solid rgba(97, 106, 120, 0.07);
  padding-bottom: 20px;
  box-sizing: border-box;
  .c_l {
    width: auto;
    p:nth-child(-n + 1) {
      color: #444;
    }
  }
}
</style>
