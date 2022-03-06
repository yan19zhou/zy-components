<!--
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-12-21 14:58:20
 * @LastEditTime: 2021-12-21 15:26:59
 * @LastEditors: zhouy
-->
<template>
  <div class="box">
    <div ></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.box {
  padding: 4px;
  position: relative;
  overflow: hidden;
  width: 200px;
  div{
      height: 38px;
  }
}

.box > * {
  background-color: #fff;
  position: relative;
}

.box:before {
  content: "";
  animation: roll linear 2s infinite;
  background: conic-gradient(#58e, #fff);
  position: absolute;
  width: 200%;
  padding-top: 200%;
  left: 50%;
  top: 50%;
}

@keyframes roll {
  from {
    transform: translate(-50%, -50%) rotateZ(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotateZ(-360deg);
  }
}
</style>
