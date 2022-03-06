<template>
  <div class="v-dialog cCommonSelect">
    <el-dialog
      :visible.sync="isOpen"
      :width="width"
      :fullscreen="fullscreen"
      @close="close"
      :append-to-body="true"
      :custom-class="!fullscreen ? 'dialog-fullscreen': ''"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div slot="title">
        <div class="flex-bc mr20 dialog-title">
          <div class="left">承租方选择</div>
          <div class="right pr20">
            <span class="el-icon-full-screen cursor" @click="fullscreen=!fullscreen"></span>
          </div>
        </div>
      </div>
      <div v-loading="loading" element-loading-text="数据加载中...">
        <dataList
          placeholder="请输入承租方名称或者证件号查询"
          :pageInfo="pager"
          :listData="clientInfos"
          :selectData="selectedClientInfos"
					:page-size="5"
          searchName="clientLesseeName"
          :menuList="[]"
          @menu-click="handleMenuClick"
          layout="total, prev, pager, next"
          noPadding
          openSelection
        >
          <el-table ref="clientTable" :data="clientInfos" stripe @selection-change="handleSelect">
            <el-table-column width="55" type="selection" />
            <el-table-column prop="clientLesseeName" label="承租方名称" :selectable="canSelected" />
            <el-table-column label="客户类型" prop="clientLesseeType" :formatter="lesseeTypeFormater" />
            <el-table-column label="证件类型" prop="certificateType" :formatter="commercial_certificate_type" />
            <el-table-column prop="certificateNum" label="证件号码" width="180" />
            <el-table-column prop="phoneNum" label="手机号码" width="180" />
            <el-table-column prop="address" label="详细地址" width="180" />
          </el-table>
        </dataList>
      </div>
      <div slot="footer">
        <el-button @click="ok">确定</el-button>
        <el-button @click="close">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
//物业选择组件
import { fetchList } from "@/views/wy-client/api/clientlessee";
import { getDict } from "@/utils";
export default {
  name: "client-select",
  props: {
    width: {
      type: String,
      default: "1200px",
    },
    // 禁用选择项
    disabledArr: {
      type: Array,
      default: () => []
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: true
    }
  },
  provide () {
    return {
      initList: this.queryData,
    };
  },
  data () {
    return {
      isOpen: false,
      isInit: true,
      fullscreen: false,
      clientInfos: [], //物业列表
      selectedClientInfos: [], //当前选择的物业列表，

      page: {
        currentPage: 1,
        pageSize: 5,
        total: 0,
      },
      // 请求参数
      params: {
        current: 1,
        size: 5,
        clientLesseeName: "",
      },

      // 分页
      pager: {
        total: 0, // 总页数
        current: 1, // 当前页数
        size: 10, // 每页显示多少条
      },
      // 页面loading
      loading: false,
    };
  },
  computed: {
    lessee_type () {
      return getDict("lessee_type");
    },
  },
  methods: {
    // 监听选中
    handleSelect (val) {
      if (!this.multiple) {
        if (val.length > 1) {
          this.$refs.clientTable.clearSelection()
          this.$refs.clientTable.toggleRowSelection(val[val.length - 1])
        }
        this.selectedClientInfos = [val.pop()];
      } else {
        this.selectedClientInfos = val
      }
    },
    // 客户类型格式化
    lesseeTypeFormater (row, column, cellValue) {
      let obj = this.lessee_type.find((p) => p.value == cellValue);
      return obj ? obj.label : "";
    },
    commercial_certificate_type (row, column, cellValue) {
      const { clientLesseeType, certificateType } = row;
      const list = getDict(
        clientLesseeType == 0
          ? "personage_certificate_type"
          : "commercial_certificate_type"
      );
      const data = list.find((item) => (item.value = certificateType));
      return data ? data.label : "";
    },
    // 数据请求
    queryData (params = {}) {
      this.loading = true;
      let requestData = { ...this.params, ...params };
      fetchList(requestData)
        .then((res) => {
          const { current, size, total, records } = res.data.data;
          this.clientInfos = records;
          this.params = requestData;
          this.pager = { total, current, size };
        })
        .finally(() => {
          this.loading = false;
        });
    },
    show () {
      this.isOpen = true;
      if (this.isInit) {
        this.isInit = false;
        this.queryData();
      }
    },

    ok () {
      this.$emit("completeSelect", this.selectedClientInfos);
      this.isOpen = false;
    },
    handleMenuClick (type) {
      switch (type) {
        case "add":
          this.$router.push({ path: "/client-manage/lessee-manage/edit" });
          break;
      }
    },
    close () {
      this.isInit = true;
      this.selectedClientInfos.length = 0;
      this.isOpen = false;
      this.params = {
        current: 1,
        size: 10,
        clientLesseeName: "",
      }
    },
    // 判断数据列表是否可选择
    canSelected (row) {
      if (!this.disabledArr.length) return 1;
      return this.disabledArr.includes(row.clientLesseeId) ? 0 : 1
    }
  },
};
</script>

<style lang="scss" >
@import "./scss/commonSelect";
</style>

