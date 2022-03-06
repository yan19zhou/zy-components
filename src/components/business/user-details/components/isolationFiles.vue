<!--
 * @Description: 隔离文件清单
 * @Author: zhouy
 * @Date: 2021-10-08 10:08:06
 * @LastEditTime: 2021-10-08 14:20:09
 * @LastEditors: zhouy
-->

<template>
  <div>
    <dataList ref="dataList" :pageInfo="pager" :listData="tableData" :listLayout="['menu']" @btn-click="handleBtnClick">
      <div slot="buttons" class="btns">
        <el-button size="small" type="primary" @click="handleBtnClick({ type: 'batchDownload' })">下载</el-button>
      </div>
      <el-table style="width: 100%" :data="tableData" @selection-change="selectionChange" reserveSelection rowKey="fileId">
        <el-table-column type="selection" />
        <el-table-column label="序号" width="55">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="busiTypeCode" label="类型" width="140" :formatter="dataFormatter" />
        <el-table-column prop="fileName" label="文件名称" width="200" />
        <el-table-column label="附件">
          <template slot-scope="scope">
            <el-link @click="previewDownload(scope.row.fileId, scope.row.busiTableName)"><i :class="['iconfont link-icon', iconClass(scope.row.busiTableName)]"></i>{{ scope.row.busiTableName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="creatime" label="上传时间" width="160" />
        <el-table-column prop="creapers" label="上传人" width="110" />
      </el-table>
    </dataList>
    <!-- 预览pdf -->
    <v-dialog title="预览" append-to-body :show.sync="pdfDialogVisible" width="1200px">
      <v-pdf :fileId="fileId" requestUrl="/jdglattachmentfile/attachment/download/" v-if="pdfDialogVisible" />
    </v-dialog>
    <!-- 预览图片 -->
    <el-image ref="elImage" v-show="false" style="width: 100px; height: 100px" :src="imgUrl" :preview-src-list="srcList"> </el-image>
  </div>
</template>

<script>
import { fetchList, previewFile, delAttachmentfile } from "@/views/yq-personnel/multipleManage/js/api.js";
import { extractName } from "@/utils/extract";
import { downloadBlob } from "@/utils";
import vPdf from "@/components/v-pdf";
import dbl from "@/utils/dbl";
import { mixinsId } from "../mixin/mixinId";
const previewDownloadMap = {
  preview: ["jpg", "png", "pdf"],
  download: ["xls", "xlsx", "docx"],
  video: ["mp4"],
};
export default {
  components: { vPdf },
  mixins: [mixinsId],
  inject: ["personId", "row"],
  provide() {
    return {
      initList: this.fetchList,
    };
  },
  data() {
    return {
      videoVisible: false,
      previewUrl: "",
      tableData: [],
      // 分页
      pager: {
        total: 0, // 总页数
        current: 1, // 当前页数
        size: 10, // 每页显示多少条
      },
      // 页面loading
      loading: false,
      dialogVisible: false,
      fileId: "",
      pdfDialogVisible: false,
      imgUrl: "",
      srcList: [],
      selectionArr: [],
    };
  },
  methods: {
    //格式化表格字典值
    dataFormatter(row, column, cellValue) {
      switch (column.property) {
        case "busiTypeCode":
          return extractName("file_type", row.busiTypeCode);
      }
    },
    //表格按钮点击事件监听
    handleBtnClick({ type, row }) {
      switch (type) {
        // 批量下载
        case "batchDownload":
          if (!this.selectionArr.length) return this.$message.warning("请选择文件!");
          this.selectionArr.forEach((item) => {
            this.downloadFile(item.fileId, item.busiTableName);
          });
          break;
      }
    },
    iconClass(fileNote, type) {
      if (!fileNote) return "";
      let exp = fileNote.substring(fileNote.lastIndexOf(".") + 1);
      let types = {
        image: ["jpg", "png"],
        pdf: ["pdf"],
        video: ["mp4", "avi", "wmv", "mpeg", "m4v", "mov", "asf", "flv", "f4v", "rmvb", "rm", "3gp"],
      };
      if (type && !types.video.includes(exp)) {
        return "icon-lianjie";
      } else if (types.image.includes(exp)) {
        return "icon-tupian";
      } else if (types.pdf.includes(exp)) {
        return "icon-PDF";
      } else if (types.video.includes(exp)) {
        return "icon-icon_A";
      } else {
        return "icon-WORD";
      }
    },
    // 点击预览或下载
    async previewDownload(fileId, fileNote) {
      let exp = fileNote.substring(fileNote.lastIndexOf(".") + 1);
      if (previewDownloadMap.preview.includes(exp)) {
        this.fileId = fileId;
        // 预览pdf
        // if(exp === 'pdf') return pdfobject.embed(`/book/file/download/${fileId}`, "#example1");
        if (exp === "pdf") return (this.pdfDialogVisible = true);
        // 预览图片
        this.imgUrl = this.$prefix + "/jdglattachmentfile/attachment/download/" + fileId;
        this.srcList = [this.imgUrl];
        this.$nextTick(() => {
          this.$refs.elImage.clickHandler();
        });
      } else if (previewDownloadMap.download.includes(exp)) {
        // 下载其它类型文件
        this.downloadFile(fileId, fileNote);
      } else if (previewDownloadMap.video.includes(exp)) {
        // 视频预览
        this.videoVisible = true;
        this.pdfDialogVisible = false;
        this.previewUrl = this.$prefix + "/jdglattachmentfile/attachment/download/" + fileId + "?Authorization=" + dbl.get("token");
      } else {
        this.$message.warning("文件不存在或已删除！");
      }
    },
    async fetchList() {
      this.loading = true;
      let res = await fetchList(this.id);
      const { current, size, total, records } = res.data.data;
      this.tableData = records;
      this.pager = { total, current, size };
      this.loading = false;
    },
    selectionChange(selection) {
      this.selectionArr = selection;
    },
    async downloadFile(fileId, fileName) {
      let res = await previewFile(fileId);
      downloadBlob(res.data, fileName);
    },
  },
};
</script>

<style lang="scss" scoped>
@import url("../../../../assets/icon/jzgl-cs/iconfont.css");
.link-icon {
  margin-right: 6px;
}
.baseInfo {
  display: flex;
  justify-content: space-around;
}
</style>
