// ocr扫描结果预览组件
<template>
  <div class="ocrPreview resource-manage">
    <div class="card-box">
      <div class="card-title">OCR扫描识别信息</div>
      <div class="ocrContent" v-scrollBar>
        <ul>
          <li v-for="(value,key) in ocrData" :key="key">
            <p class="label">{{key}}：</p>
            <p class="value">{{value}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ocrPreview',
  props: {
    // 扫描结果信息
    ocrData: {
      type: Object,
      default: () => { }
    }
  }
}
</script>

<style lang="scss" scoped>
.ocrContent {
  width: 100%;
  background-color: #f1f1f1;
  margin-top: 20px;
  border-radius: 4px;
  max-height: 500px;
  padding: 10px 20px;
  ul {
    display: flex;
    flex-wrap: wrap;
    text-align: left;
    font-size: 14px;
    li {
      width: 32%;
      margin: 8px 2% 8px 0;
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
    p {
      line-height: 32px;
    }
    .label {
      color: #666;
    }
    .value {
      color: #404040;
    }
  }
}
</style>