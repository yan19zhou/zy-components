// ocr扫描上传预览组件
<template>
  <div class="ocrUploadWrap">
    <!-- 未传文件 -->
    <div class="templateUpload" v-if="fileList.length === 0">
      <div class="icon">
        <i class="el-icon-document elIcon" />
      </div>
      <p>模板空空，赶紧导入...</p>
      <el-upload
        class="upload-demo"
        ref="upload"
        :multiple="multiple"
        action="/admin/sys-file/upLodeFileAdd"
        :auto-upload="false"
        :file-list="fileList"
        :on-change="handleTemplateChange"
        accept=".jpg, .png, .pdf"
      >
        <el-button class="exportBtn" type="primary">开始导入</el-button>
        <div slot="tip" class="el-upload__tip">支持导入格式：jpg、png、pdf，pdf文件单次录入最多上传一个，图片文件上传数量不限。</div>
      </el-upload>
    </div>
    <!-- 已传文件 -->
    <div class="templateShow" v-else>
      <div class="fileWrap" v-if="previewType == 'pdf'">
        <pdf ref="pdf" :src="pdfUrl" :page="1" style="width: 100%" />
        <div class="wrap">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="/admin/sys-file/upLodeFileAdd"
            :auto-upload="false"
            :file-list="fileList"
            :on-change="handleTemplateChange"
            accept=".pdf"
            :show-file-list="false"
          >
            <el-button size="medium">重新上传</el-button>
          </el-upload>
          <el-button size="medium" @click="openPreview">预览文件</el-button>
        </div>
      </div>

      <div class="pictureFileWrap" v-if="previewType == 'img'">
        <ul class="imgList">
          <li v-for="(item, index) in fileList" :key="index">
            <img :src="item.url" alt />
            <span class="operaItem" @click="handlePictureCardPreview(item.url)">
              <i class="el-icon-zoom-in icon"></i>
            </span>
            <span class="operaItem" @click="handlePictureCardRemove(index)">
              <i class="el-icon-delete icon"></i>
            </span>
          </li>
          <li>
            <el-upload
              class="upload-demo"
              ref="upload"
              action="/admin/sys-file/upLodeFileAdd"
              :auto-upload="false"
              :file-list="fileList"
              :on-change="handleTemplateChange"
              accept=".jpg, .png"
              :show-file-list="false"
            >
              <div class="add">
                <i class="icon el-icon-plus"></i>
                <p>添加图片</p>
              </div>
            </el-upload>
          </li>
        </ul>
      </div>
    </div>
    <!-- pdf预览 -->
    <el-dialog title="OCR文件预览" width="800px" :visible.sync="dialogContractVisible" :close-on-click-modal="false">
      <v-pdf :src="pdfUrl" />
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog title="OCR文件预览" width="800px" :visible.sync="dialogPictureVisible" :close-on-click-modal="false">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import vPdf from '@/components/v-pdf'
export default {
  name: 'ocrUpload',
  components: {
    pdf,
    vPdf
  },
  data () {
    return {
      // 是否多选
      multiple: true,
      // 文件列表
      fileList: [],
      // 预览类型 pdf | img
      previewType: '',
      // pdf预览弹窗
      dialogContractVisible: false,
      // pdf预览地址
      pdfUrl: '',
      // 图片预览弹窗
      dialogPictureVisible: false,
      // 图片预览地址
      dialogImageUrl: ''
    }
  },
  computed: {
    // 文件类型
    fileType () {
      return {
        img: ['image/png', 'image/jpg', 'image/jpeg'],
        pdf: ['application/pdf']
      }
    },
  },
  methods: {
    // 监听上传组件变化
    handleTemplateChange (file, fileList) {
      let filetypeName = this.fileType.pdf.includes(file.raw.type) ? 'pdf' : 'img'
      if (this.fileList.length === 0) {
        this.multiple = filetypeName === 'pdf'
      } else {
        let fileListType = this.fileType.pdf.includes(this.fileList[0].raw.type) ? 'pdf' : 'img'
        if (filetypeName != fileListType) {
          this.$message.error('请不要同时上传pdf和图片文件')
          return;
        }
      }
      if (filetypeName === 'pdf') {
        let url = window.URL.createObjectURL(file.raw)
        this.pdfUrl = url
        this.fileList = [file]
      } else {
        this.fileList = fileList.map(item => {
          return { ...item, url: this.createPreviewUrl(item) }
        })
      }
      this.previewType = filetypeName
    },
    // 移除待上传文件列表
    handleRemove (file) {
      let list = this.fileList.filter(item => item.uid !== file.uid)
      this.fileList = list
    },
    // 开启预览
    openPreview () {
      this.dialogContractVisible = true
    },
    // 图片预览
    handlePictureCardPreview (url) {
      this.dialogImageUrl = url
      this.dialogPictureVisible = true
    },
    // 图片删除
    handlePictureCardRemove (index) {
      this.fileList = this.fileList.filter((item, ind) => index !== ind)
    },
    // 生成图片预览地址
    createPreviewUrl (event) {
      var URL = null;
      if (window.createObjectURL != undefined) {
        // basic
        URL = window.createObjectURL(event.raw);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        URL = window.URL.createObjectURL(event.raw);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        URL = window.webkitURL.createObjectURL(event.raw);
      }
      return URL
    },
    // 父组件获取上传文件
    getFiles () {
      if (this.fileList.length === 0) {
        this.$message.error('请先上传扫描文件')
        return false
      } else {
        return this.fileList
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 导入步骤
.templateUpload {
  width: 100%;
  margin: 40px auto 0;
  .icon {
    width: 136px;
    height: 136px;
    border-radius: 50%;
    border: 2px solid #e3e3e4;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
  }
  .elIcon {
    font-size: 70px;
    color: #999;
  }
  p {
    font-size: 14px;
    margin-top: 20px;
    color: #333;
  }
  .exportBtn {
    width: 145px;
    height: 48px;
    font-size: 15px;
    margin-top: 20px;
  }
  .el-upload__tip {
    font-size: 13px;
    color: #999;
  }
}

.templateShow {
  padding: 0 20px;
  display: flex;
  justify-content: center;
  .fileWrap {
    width: 450px;
    height: 450px;
    border: 1px solid #eaeaea;
    transition: 0.5s;
    margin-right: 22px;
    overflow: hidden;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    .wrap {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      transition: all 0.4s linear;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .el-button {
        opacity: 0;
        transition: all 0.3s linear;
        margin: 15px 0;
        background-color: rgba(0, 0, 0, 0);
        border-color: #fff;
        color: #fff;
        &:hover {
          background-color: #2f54eb;
          border-color: #2f54eb;
        }
      }
    }
    &:hover {
      .wrap {
        background-color: rgba(0, 0, 0, 0.6);
        .el-button {
          opacity: 1;
        }
      }
    }
    /deep/ .el-upload {
      width: 100%;
      height: 100%;
    }
    .add {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .icon {
        margin: 0 auto;
        font-size: 60px;
        color: #ccc;
      }
    }
    .el-upload__tip {
      color: #999;
      margin-top: 20px;
      font-size: 13px;
    }
  }
}

.pictureFileWrap {
  .imgList {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 200px;
      height: 200px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin: 0 18px 18px 0;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      &::after {
        content: "";
        width: 100%;
        height: 100%;
        opacity: 0.5;
        transition: all 0.3s linear;
        position: absolute;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 0;
      }
      &:hover {
        &::after,
        .operaItem {
          opacity: 1;
        }
      }
      &:last-child::after {
        display: none;
      }
      .operaItem {
        color: rgba(255, 255, 255, 0.7);
        position: relative;
        margin: 0 20px;
        z-index: 10;
        cursor: pointer;
        transition: all 0.3s linear;
        opacity: 0;
        &:hover {
          color: #fff;
        }
        .icon {
          font-size: 24px;
        }
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        left: 0;
        top: 0;
        pointer-events: none;
      }
    }
    .upload-demo {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .add {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .icon {
        font-size: 70px;
        color: #eee;
        font-weight: bold;
      }
      p {
        font-size: 14px;
        color: #999;
      }
    }
  }
}
</style>