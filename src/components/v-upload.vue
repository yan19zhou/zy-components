<template>
  <div class="cUpload" :class="type">
    <!-- 上传组件 -->
    <el-upload
      ref="upload"
      :action="$prefix+'/admin/sys-file/upload'"
      :list-type="listType"
      :accept="uploadAttr.limit"
      :auto-upload="false"
      :file-list="fileList"
      :on-change="handleChange"
      :on-remove="handleChange"
      :multiple="multiple"
      v-if="!isView"
    >
      <div slot="tip" class="el-upload__tip" v-if="!hideExplain">
        {{ uploadAttr.tips }}
      </div>
      <!-- 图片、视频类型上传按钮 -->
      <div class="uploadBtn" v-if="['image', 'video'].includes(type)">
        <i slot="default" class="el-icon-plus"></i>
        <p style="font-size: 8px">{{ uploadAttr.name }}</p>
      </div>
      <!-- 文件类型上传按钮 -->
      <div class="upload-text all-center" v-else>
        <span class="el-icon-upload2"></span>
        <span>上传文件</span>
      </div>

      <!-- 图片视频上传预览 -->
      <div
        slot="file"
        slot-scope="{ file }"
        v-if="['image', 'video'].includes(type)"
      >
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          alt
          v-if="type === 'image'"
        />
        <video
          class="uploadVideoItem"
          preload="metadata"
          :src="file.url + '#t=3'"
          v-if="type === 'video'"
        />
        <div class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePreview(file, type)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </div>
      </div>
    </el-upload>
    <!-- 已上传文件列表 -->
    <div class="mark mt12" v-if="loadFileList.length">
      <div class="text-tips" v-if="!hideExplain">上传文件列表:</div>
      <div class="flex-c" v-for="(item, index) in loadFileList" :key="index">
        <div
          class="img"
          v-if="
            item.busiType &&
            item.busiType.split('/')[0] === '图片文件' &&
            showImgPreview
          "
        >
          <el-image
            :src="$prefix + api + 'img/' + item.fileId"
            :preview-src-list="[$prefix+ api + 'img/' + item.fileId]"
          ></el-image>
        </div>
        <div class="name mr20" @click="handleClickFile(item.fileId, item.fileNote)">
          {{ item.fileNote + "(" + item.fileSize + ")" }}
        </div>
        <div class="date mr20">{{ item.moditime }}</div>
        <div class="btn">
          <el-button type="text" @click="downloadLoadFile(item)"
            >下载</el-button
          >
          <el-button
            type="text"
            v-if="item.busiType && item.busiType.split('/')[1] === 'pdf'"
            @click="viewPdf(item)"
            >预览</el-button
          >
          <el-button
            type="text"
            v-if="canDelete || !isView"
            @click="deleteLoadFile(item)"
            >删除</el-button
          >
        </div>
      </div>
    </div>
    <!-- 图片、文档预览弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      append-to-body
      :close-on-click-modal="false"
    >
      <img width="100%" :src="previewUrl" alt v-if="previewType === 'image'" />
    </el-dialog>
    <!-- 图片、文档预览弹窗 -->
    <!-- <el-dialog :visible.sync="previewPdf" append-to-body :close-on-click-modal="false" :fullscreen="previewType === 'pdf'" class="previewPdfDialog">
      <embed :src="previewUrl" type="application/pdf" width="100%" height="100%" />
    </el-dialog>-->

    <!-- 视屏预览弹窗 -->
    <v-video
      :src.sync="previewUrl"
      :visible.sync="videoVisible"
      v-show="previewUrl"
    />
  </div>
</template>

<script>
import dbl from "@/utils/dbl";
import {
  getFiles,
  delFile,
  checkFiles,
} from "@/api/operate-construction-contract";
import { mapState } from "vuex";
import { download } from "@/admin/api/common";
import { downloadBlob } from "@/utils";
import vPdf from "@/components/v-pdf";
import vVideo from "@/components/v-video";
export default {
  name: "v-upload",
  components: {
    vVideo,
    vPdf,
  },
  props: {
    // 业务id
    busId: {
      type: String,
      default: "",
    },
    // 模块id
    modelType: {
      type: String,
      required: true,
    },
    /**
     * 上传文件类型
     * 支持类型['image','video','file']
     */
    type: {
      type: String,
      default: "file",
      validator(value) {
        return ["image", "video", "file"].includes(value);
      },
    },
    // 文件上传大小限制【单位MB】
    fileSize: {
      type: Number,
      default: 102400,
    },
    // 是否预览模式【如果为true那么不显示上传按钮】
    isView: {
      type: Boolean,
      default: false,
    },
    // 自动加载已上传的文件列表
    autoLoadFiles: {
      type: Boolean,
      default: true,
    },
    // 隐藏上传说明文字
    hideExplain: {
      type: Boolean,
      default: false,
    },
    // 是否支持删除已上传的文件列表
    canDelete: {
      type: Boolean,
      default: false,
    },
    // 是否支持多选上传
    multiple: {
      type: Boolean,
      default: false,
    },
	// 接口前缀（管理工作台使用 /book/file/）
	api: {
		type: String,
		default: '/admin/sys-file/'
	},
    // 已上传文件列表是否显示预览小图
    showImgPreview: {
      type: Boolean,
      default: true,
    },
    // 文件支持格式
    fileTips: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    // && this.modelType
    this.busId && this.autoLoadFiles && this.getFiles();
  },
  data() {
    return {
      // 文件列表
      fileList: [],
      // 展示文件列表
      loadFileList: [],
      // 图片弹窗
      dialogVisible: false,
      // // pdf弹窗
      // previewPdf: false,
      // 视屏弹窗
      videoVisible: false,
      // 预览弹窗展示的类型
      previewType: "",
      // 预览文件的地址
      previewUrl: "",
    };
  },
  computed: {
    ...mapState({
      canUploadFiles: (state) =>
        state.canUploadFile.reduce(
          (total, item, index) =>
            index === 0 ? "." + item : `${total},.${item}`,
          ""
        ),
    }),
    // 上传组件的基本属性【上传提示、上传格式、上传按钮文案】
    uploadAttr() {
      return {
        file: {
          type: "文件",
          name: "上传文件",
          limit: this.canUploadFiles,
          tips: this.fileTips.length > 0 ?"上传文件：支持拓展名：" + this.fileTips.join("、"): '',
        },
        video: {
          type: "视频",
          name: "上传视频",
          limit: ".wmv,.mpeg,.mp4",
          tips: "上传视频：支持扩展名：wmv、mpeg、mp4",
        },
        image: {
          type: "图片",
          name: "上传图片",
          limit: ".jpg,.jpeg,.png,.gif,.bmp",
          tips: "上传图片：支持扩展名：jpg、jpeg、png、gif、bmp",
        },
      }[this.type];
    },
    // 文件列表的类型
    listType() {
      return ["image", "video"].includes(this.type) ? "picture-card" : "text";
    },
  },
  methods: {
    // 文件上传
    submit(
      url = this.api + "multipart_file/upload",
      module = this.modelType,
      busId = this.busId
    ) {
      // 当没有文件上传时，也可以使用submit方法，触发onSuccess
      if (this.fileList.length == 0) {
        this.$emit("onSuccess", busId);
        return;
      }
      let submit = () => {
        if (!this.checkFile()) return;
        const loading = this.$loading({
          lock: true,
          text: "文件上传中...",
          spinner: "el-icon-loading",
        });
        try {
          let formData = new FormData();
          this.fileList.forEach((file) => {
            formData.append("files", file.raw);
          });
          formData.append("modelType", module);
          busId && formData.append("busiId", busId);

          this.http
            .post(url, formData)
            .then((resp) => {
              resp.data.code === 0
                ? this.onSuccess(resp.data, null, this.fileList)
                : this.onError(resp.data, null, this.fileList);
            })
            .finally((resp) => {
              loading.close();
            });
        } catch (e) {
          loading.close();
          this.onError(e);
        }
      };
      // 文件合法校验
      let totalSize = this.fileList.reduce(
        (total, item) => total + item.size,
        0
      );
      if (totalSize / 1024 / 1024 > 500) {
        this.$confirm(
          "您上传的超过500M，文件较大，预期消耗时间较多，是否继续？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then((a) => {
            submit();
          })
          .catch(() => {
            this.$message("已取消上传");
          });
      } else {
        submit();
      }
    },
    // 上传成功
    onSuccess(response, file, fileList) {
      this.$emit("onSuccess", response, file, fileList);
      this.fileList = [];
      this.$emit("input", []);
    },
    // 上传失败
    onError(err, file, fileList) {
      this.$message.error("上传失败！");
      this.$emit("onError", err, file, fileList);
    },
    // 上传文件校验
    checkFile() {
      let flag = false;
      const { limit, type } = this.uploadAttr;
      this.fileList.forEach((item) => {
        if (!flag) {
          let fileName = item.name,
            lastIndex = fileName.lastIndexOf("."),
            suffix = fileName.substring(lastIndex, fileName.length),
            suffix2 = fileName.substring(lastIndex + 1, fileName.length);
          if (!(item.size / 1024 / 1024 < this.fileSize)) {
            this.$message.error(`上传文件大小不能超过 ${this.fileSize}MB!`);
            flag = true;
          } else if (limit.indexOf(suffix) == -1) {
            this.$message.error(`${type}上传暂不支持${suffix}格式！`);
            flag = true;
          } else if (this.type == 'file'
          				&& this.fileTips.length > 0
          			&& this.fileTips.indexOf(suffix2) == -1) {
				this.$message.error(`${type}上传不支持${suffix}格式！`);
				flag = true;
          }
        }
      });
      return !flag;
    },
    // 监听上传组件变化
    handleChange(file, fileList) {
      this.fileList = fileList;
      this.$emit("input", fileList);
    },
    // 移除待上传文件列表
    handleRemove(file) {
      let list = this.fileList.filter((item) => item.uid !== file.uid);
      this.fileList = list;
      this.$emit("input", list);
    },
	// 获取已传文件列表
    getFiles(busId = this.busId, modelType = this.modelType) {
      // && this.modelType
      busId &&
        getFiles(busId, modelType, this.api + 'getFileList').then(
          (res) => {
            if (res.data.code === 0) {
              this.loadFileList = [...res.data.data];
              console.log(this.loadFileList)
              this.$emit("loadCompleted", res.data.data);
            }
          }
        );
    },
    // 删除已传文件
    deleteLoadFile(item) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const resp = await delFile(this.api + 'delFileByFileId', item.fileId);
          if (resp.data.code === 0) {
            this.$message.success("删除成功!");
            this.getFiles();
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    handleClickFile(fileId, fileNote) {
      this.$emit('handleClickFile', fileId, fileNote);
    },
    // 图片视频查看
    handlePreview(file, type) {
      this.previewUrl = file.url;
      this.previewType = type;
      if (type == "image") {
        this.dialogVisible = true;
      } else {
        this.videoVisible = true;
      }
    },
    // pdf预览
    async viewPdf(item) {
      let loading = this.$loading();
      try {
        const res = await checkFiles(item.fileId, `${this.api}checkFileIsNot`);
        if (res.data.code === 0) {
          this.previewType = "pdf";
          if (!item.fileId) return;
          const response = await download(
            this.api + "pdf/" + item.fileId,
            null
          );
          window.open(window.URL.createObjectURL(response.data));
          loading.close();
        }
      } catch (error) {
        loading.close();
      }
    },
    // 资源下载
    async downloadLoadFile(item) {
      // const res = await checkFiles(item.fileId)
      // if (res.data.code === 0) {
      download(`${this.api}download/${item.fileId}`, null, "arraybuffer").then(
        (response) => {
          downloadBlob(response.data, item.fileNote);
        }
      );
      // } else {
      //   this.$message.warning('文件不存在或已删除！')
      // }
      this.$emit("download", item);
    },
	init(){
		this.loadFileList = [];
		this.fileList = [];
	}
  },
};
</script>

<style lang="scss" >
.cUpload {
  &.file {
    .el-upload__tip {
      color: #999;
      margin-left: 10px;
      display: inline-block;
    }
  }
  /deep/ .el-upload-list--text {
    max-width: 400px;
  }
  .el-upload__tip {
    color: #999;
  }
  .uploadBtn {
    width: 100%;
    height: 100%;
    transition: all 0.3s;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #8c939d;
    background-color: #fbfdff;
    box-sizing: border-box;
    p {
      line-height: 1;
    }
    .el-icon-plus {
      font-size: 16px;
      color: #8c939d;
      margin-bottom: 5px;
    }
    &:hover {
      border-color: #409eff;
    }
  }
  /deep/ .el-upload-list--picture-card {
    li,
    li > div {
      vertical-align: middle;
      line-height: 146px;
      display: inline-block;
    }
    .el-upload-list__item-thumbnail {
      height: auto;
    }
    .uploadVideoItem {
      width: 100%;
      height: auto;
      display: block;
    }
  }
  .mark {
    .flex-c {
      margin-top: 10px;
    }
    .img {
      border: 1px solid #c0c4cc;
      border-radius: 4px;
      width: 52px;
      height: 52px;
      margin: 0 10px 0 0;
      .el-image {
        width: 50px;
        height: 50px;
        overflow: hidden;
      }
    }
    .date {
      color: #999;
    }
  }
}
.el-image-viewer__wrapper {
  z-index: 3000 !important;
}
</style>