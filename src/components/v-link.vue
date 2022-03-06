<!--
 * @Description: 
 * @Author: zhouy
 * @Date: 2021-07-29 10:50:58
 * @LastEditTime: 2021-07-29 16:42:50
 * @LastEditors: zhouy
-->
<template>
  <div class="v-link">
    <div class="add-link-btn el-upload upload-text all-center" v-if="!isView">
      <span class="el-icon-link"></span>
      <span @click="addLink">添加链接</span>
    </div>
    <ul class="link-list">
      <li
        v-for="(file, index) in linkList"
        :key="index"
        :class="[
          'el-upload-list__item flex-c link-item',
          focusing ? 'focusing' : '',
        ]"
        @keydown.delete="!isView && remove(file, index)"
        @focus="focusing = true"
        @blur="focusing = false"
        @click="focusing = false"
      >
        <el-link :href="file.linkUrl" target="_blank"
          ><i class="el-icon-document"></i>{{ file.linkName }}</el-link
        >
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-link"></i>
        </label>
        <i
          class="el-icon-close"
          v-if="!isView"
          @click="remove(file, index)"
        ></i>
      </li>
    </ul>
    <el-dialog
      title="添加链接"
      :modal="false"
      v-dialogDrag
      :visible.sync="dialogVisible"
      width="40%"
      @closed="handleClose"
      append-to-body
    >
      <el-form
        :rules="rules"
        :model="formData"
        ref="dialogForm"
        style="padding-top:0px;"
      >
        <el-form-item label="链接文字：" prop="linkName" class="full">
          <el-input placeholder="请输入链接文字" v-model="formData.linkName" />
        </el-form-item>
        <el-form-item label="链接地址：" prop="linkUrl">
          <el-input v-model="formData.linkUrl" placeholder="如：https://..." />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirm">提交</el-button>
          <el-button @click="dialogVisible = false">返回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    // 是否预览模式【如果为true那么不显示添加链接按钮】
    isView: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogVisible: false,
      focusing: false,
      formData: {
        linkName: "",
        linkUrl: "",
      },
      linkList: [],
      rules: {
        linkName: [{ required: true, message: "请输入链接文字", trigger: "blur" }],
        linkUrl: [{ required: true, message: "请输入链接地址", trigger: "blur" }],
      },
    };
  },
  methods: {
    handleClose() {
      this.$refs.dialogForm.resetFields();
    },
    async confirm() {
      let valid = await this.$refs.dialogForm.validate();
      if (!valid) return;
      const obj = JSON.parse(JSON.stringify(this.formData));
      this.linkList.push(obj);
      this.$emit("input", this.linkList);
      this.dialogVisible = false;
    },
    remove(link, index) {
      //移除链接
      this.linkList.splice(index, 1);
      this.$emit("input", this.linkList);
    },
    addLink() {
      this.dialogVisible = true;
    },
  },
  watch: {
    value: {
      handler(val) {
        this.linkList = val;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.v-link {
  margin-top: 10px;
  .link-item {
    color: #666;
    display: block;
    margin-right: 0.20833rem;
    overflow: hidden;
    padding-left: 0.02083rem;
    text-overflow: ellipsis;
    -webkit-transition: color 0.3s;
    transition: color 0.3s;
    white-space: nowrap;
    i {
      margin-right: 0.03646rem;
    }
    .el-upload-list__item-name:hover {
      &::before {
        width: 100%;
        border-bottom: solid 1px #ccc;
      }
    }
  }
}
</style>
