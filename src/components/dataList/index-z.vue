<template>
  <div class="dataList" :class="{ smallPadding: pure, noPadding }">
    <!-- 列表顶部 -->
    <el-row :gutter="30" type="flex" justify="space-between" class="listTop" v-if="showListTop">
      <!-- 搜索组件 -->
      <el-col :span="filterSpan" class="searchPanel">
        <div class="cfilterRight">
          <!-- 文字搜索框 -->
          <div class="searchPanel" v-if="listLayout.includes('search')">
            <slot name="search">
              <el-input class="searchInput" v-halfCharCode :placeholder="placeholder" v-model="searchValue" @change="searchByKeywords" clearable @clear="handleClear">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                <el-button class="searchBtn" type="primary" size="mini" slot="append" @click="searchByKeywords(searchValue)">搜索</el-button>
              </el-input>
            </slot>
          </div>
        </div>
      </el-col>
      <!-- 右侧按钮组 -->
      <el-col :span="menuSpan" class="btnList" :class="!listLayout.includes('search') && 'flex-full'" v-if="listLayout.includes('menu')">
        <slot name="buttons">
          <el-button size="small" v-for="(item, index) in menu" :key="item.name" :type="(index + 1) % 2 == 0 ? 'default' : 'primary'" :plain="(index + 1) % 3 == 0" @click="menuClick(item)">{{ item.label }}</el-button>
        </slot>
      </el-col>
    </el-row>
    <!-- 自定义筛选插槽 -->
    <slot name="customFilter" />

    <!-- 列表筛选[默认只显示一个按钮，点击弹窗筛选]  -->
    <div class="`listFilter" v-if="filterData.length && !pure && filterType === 'default'">
      <!-- 选中的筛选 -->
      <div class="chooseFilter">
        <el-row :gutter="72">
          <el-col :span="item.filterSpan || 6" v-for="(item, index) in filterData.filter((v) => v.hasOwnProperty('defaultValue'))" :key="index">
            <filterInput v-show="!item.hidden" :key="item.filterName + index" :ref="`${item.name}`" v-bind="item" :children="item.isLink ? linkFilterOptions[item.name] : item.children || []" binding v-model="item.value" />
          </el-col>
          <slot name="searchItemBase"></slot>
          <transition name="el-zoom-in-top">
            <div v-show="showMore">
              <el-col :span="item.filterSpan || 6" v-for="(item, index) in filterData.filter((v) => !v.hasOwnProperty('defaultValue'))" :key="index">
                <filterInput v-show="!item.hidden" :key="item.filterName + index" :ref="`${item.name}`" v-bind="item" :children="item.isLink ? linkFilterOptions[item.name] : item.children || []" binding v-model="item.value" />
              </el-col>
              <slot name="searchItem"></slot>
            </div>
          </transition>
        </el-row>
        <el-row :gutter="72">
          <el-col :span="8" style="height:1px"></el-col>
          <el-col :span="filterSpan" class="lastCol" style="text-align: center;">
            <el-button type="text" @click="showMore = !showMore" v-show="!hideFilterBtn">
              高级查询
              <i :class="['el-icon--right', showMore ? 'el-icon-arrow-down' : 'el-icon-arrow-up']" />
            </el-button>
            <slot name="searchbtn"></slot>
          </el-col>
          <el-col :span="8" style="text-align: right;">
            <el-button type="primary" size="small" @click="handleFilter">查询</el-button>
            <el-button type="default" size="small" @click="resetFilter">重置</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <slot name="beforeFilter"></slot>
    <slot name="PersonStatusFilter"></slot>
    <!-- 列表 -->
    <div class="listWrap">
      <slot>
        <el-table ref="multipleTable" :row-style="rowStyle" :data="listData" @sort-change="changsort" @selection-change="handleSelect" @select="selectChange" :row-key="rowKey" @select-all="selectAll">
          <el-table-column type="selection" width="55" v-if="openSelection" :reserve-selection="reserveSelection" />
          <el-table-column label="序号" type="index" :index="getIndex" width="55" v-if="openIndex" :fixed="indexFixed" />
          <el-table-column v-for="item in dataInfo" :key="item.prop" v-bind="item" :fixed="item.fixed">
            <template slot-scope="scope">
              <el-tag
                v-if="item.dataType == 'label' && item.tagList.some((e) => scope.row[e.name] !== 0)"
                :class="{
                  tagLsit: true,
                  follow: scope.row.follow,
                  focus: scope.row.focus,
                  diagnose: scope.row.diagnose,
                  ordinary: scope.row.ordinary,
                }"
              >
                <span v-for="tag in item.tagList" v-show="scope.row[tag.name]" :key="tag.name" :class="['iconfont', tag.class]" />
              </el-tag>
              <span v-else>{{ item.formatter ? item.formatter(scope.row, scope.column) : scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" class="operaColumn" v-if="operaInfo.length" :width="`${operaColumnWidth ? operaColumnWidth : tableMenu.length * 40}`">
            <template slot-scope="scope">
              <el-button type="text" size="mini" :class="item.class" @click="handleBtnClick(item.name, scope.row)" v-for="(item, index) in tableMenu" v-if="item.f(scope.row)" :key="index">{{ item.label }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </slot>
    </div>

    <!-- 分页 -->
    <div class="listPageInfo">
      <pager v-bind="$attrs" hideSelectTips :selectData="selectData" :pageInfo="pageInfo" @changeCurrentPage="changeCurrentPage" @changePageSize="changePageSize" :pageSizes="pageSizes" />
    </div>
  </div>
</template>

<script>
import "@/views/yq-personnel/components/PersonStatusFilter/font/iconfont.css";
import filterInput from "./components/filterInput";
import pager from "./components/pager";
export default {
  name: "dataList",
  components: {
    filterInput,
    pager,
  },
  inject: ["initList"],
  props: {
    // 极简模式【仅保留分页和列表内容插槽，移除所有其他内容】
    pure: {
      type: Boolean,
      default: false,
    },
    // 搜索参数名称
    searchName: {
      type: String,
      default: "",
    },
    // 列表数据
    listData: {
      type: Array,
      default: () => [],
    },
    //行样式回调函数
    rowStyle: {
      type: Function,
      default: function name() {},
    },
    /**
     * 表格展示数据设置
     */
    dataInfo: {
      type: Array,
      default: () => [],
    },
    /**
     * 操作菜单列表
     */
    operaInfo: {
      type: Array,
      default: () => [],
    },
    // 是否需要勾选项
    openSelection: {
      type: Boolean,
      default: false,
    },
    // 是否需要序号
    openIndex: {
      type: Boolean,
      default: false,
    },
    // 是否固定序号列
    indexFixed: {
      type: Boolean,
      default: false,
    },
    // 分页数据
    pageInfo: {
      type: Object,
      default: () => ({
        total: 0, // 总页数
        current: 1, // 当前页数
        size: Number(localStorage.getItem("pageSize")),
      }),
    },
    pageSizes: Array,
    // 选中的数据
    selectData: {
      type: Array,
      default: () => [],
    },
    // 搜索框提示语
    placeholder: {
      type: String,
      default: "请输入内容",
    },
    /**
     * 功能按钮列表
     * 默认支持【新增(add)、删除(delete)、导入(import)、导出(export)】;
     * 如果要修改名称的话，传[{add:'新增按钮'},'delete',{export:"导入按钮"}]即可
     * 如果要新增其他按钮的话，['add','delete',{test:'测试按钮'},{test2:"测试按钮2"}]
     */
    menuList: {
      type: Array,
      default: () => ["add", "delete"],
    },
    /**
     * 筛选列表
     * label: String [必填] 标题
     * inputType: String [默认值 input] 筛选类型
     * 【input:文本搜索框; dict: 字典筛选(下拉框展示), radio: 单选框, checkbox: 多选框, select: 下拉框, date: 日期, datetime: 时间日期, daterange: 日期区间, datetimerange: 时间日期区间】
     * multiple: Boolean [默认值 false] 是否多选，仅对type为dict或者select时生效
     * children: Array 自定义筛选项的列表 参考 [{ label:'是', value:'1'}]
     * dictName: String 字典名称 type为dict时必填
     * placeholder: String 筛选项提示
     * name: String 筛选项对应键名 当inputType类型为日期区间或者时间区间时，可以填一个数组,分别放开始时间和结束时间的键名 => ['startTime','endTime']
     * defaultValue: String|Array 让筛选项默认显示，设置默认筛选的值，多选或者时间区间类型时传数组，单选或者非区间类型传字符串
     * Example：
     * { label: '文字搜索筛选', inputType: 'input', name: 'input' },
     * { label: '字典筛选', inputType: 'dict', dictName: 'contract_type', name: 'dict'},
     * { label: '单选筛选',inputType: 'radio',name: 'radio',children: [{ label:'选项1', value:'1'},{ label:'选项2', value:'0'}] },
     * { label: '多选筛选', inputType: 'checkbox', name: 'checkbox', children: [{ label:'选项1', value:'1'},{ label:'选项2', value:'0'}] },
     * { label: '下拉筛选', inputType: 'select', name: 'select', children: [{ label:'选项1', value:'1'},{ label:'选项2', value:'0'}], multiple: true },
     * { label: '日期时间筛选', inputType: 'datetime', name: 'datetime',},
     * { label: '日期筛选', inputType: 'date', name: 'date',},
     * { label: '日期区间', inputType: 'daterange', name: ['startTime','endTime']},
     * { label: '日期时间区间', inputType: 'datetimerange', name: ['startTime','endTime']},
     * { label: '年份筛选', inputType: 'year', name: 'year',},
     * { label: '月份筛选', inputType: 'month', name: 'month',},
     * { label: '数字区间', inputType: 'numberRange', name: ['startNum','endNum']},
     */
    filterList: {
      type: Array,
      default: () => [],
    },
    /**
     * 筛选的展现形式，目前有两种，一种是默认只显示一个展开过滤的按钮，点击通过弹窗显示筛选项【默认:default】
     * 另一种是默认显示两个筛选项，右边有一个展开按钮，点击显示全部筛选项【all】
     */
    filterType: {
      type: String,
      default: "default",
    },
    // 筛选项所占的份数（总数24，默认8），如果是弹窗筛选类型【filterType为default】,那么是设置筛选按钮所占的份数
    filterSpan: {
      type: Number,
      default: 8,
    },
    // 菜单按钮区域所占的份数，默认8，最高16
    menuSpan: {
      type: Number,
      default: 8,
      validator(val) {
        return val >= 8 && val <= 16;
      },
    },
    // 清除组件默认上边距
    noPadding: {
      type: Boolean,
      default: false,
    },
    /**
     * 模块列表，根据场景自定义需要的模块【实验中，待完善】
     * menu: 菜单列表; search: 搜索框; filter: 数据筛选;
     */
    listLayout: {
      type: Array,
      default: () => ["menu", "search", "filter"],
    },
    // 是否隐藏更多筛选按钮
    hideFilterBtn: {
      type: Boolean,
      default: false,
    },
    // 手动设置操作列的宽度
    operaColumnWidth: {
      type: [Number, String],
      default: "",
    },
    //table的row-key
    rowKey: {
      type: Number | String,
      default: "",
    },
    // 设置table是否记忆选中
    reserveSelection: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 搜索关键词
      searchValue: "",
      // 展开搜索
      openFilter: false,
      // 条件筛选选中项
      choosedFilterList: [],
      // 开启搜索弹窗
      popVisible: false,
      // 暂存筛选参数（防止页面请求时，参数合并造成数据重置失效）
      formData: {},
      // 判断暂存筛选是否和条件筛选绑定
      ovservableNumber: 0,
      // 所有联动筛选项关联项的可选值
      linkFilterOptions: {},
      // 高级筛选
      showMore: false,
    };
  },
  computed: {
    // 菜单列表
    menu() {
      const menuInfo = {
        add: "新增",
        delete: "删除",
        import: "导入",
        export: "导出",
        ocr: "OCR录入",
      };
      return this.menuList.map((item) => {
        if (typeof item === "string") {
          console.log(menuInfo[item]);
          return { label: menuInfo[item], name: item };
        } else {
          let [name, label] = Object.entries(item)[0];
          return { label, name };
        }
      });
    },
    // 初始化筛选列表
    filterData() {
      if (!this.filterList.length) return [];
      let values = new Map();
      this.filterList.forEach((item) => {
        item.defaultValue != undefined && values.set(item.name, item.defaultValue);
      });
      // 获取联动筛选可选值
      this.setLinkFilterOptions();
      let linkNames = this.filterList.reduce((arr, i) => (i.linkName ? [...arr, i.linkName] : arr), []);
      values.size && setTimeout(() => this.setFilter(values), 0);
      let arr = this.filterList
        .map((item, index) => ({
          ...item,
          filterName: `${item.name}`,
          isLink: linkNames.includes(item.name),
          binding: false,
        }))
        .filter((v) => v.hasOwnProperty("defaultValue"));

      return this.filterList.map((item, index) => ({
        ...item,
        filterName: `${item.name}`,
        isLink: linkNames.includes(item.name),
        binding: false,
      }));
    },
    // 判断是否显示组件顶部的搜索和菜单列表
    showListTop() {
      return !this.pure || (!this.listLayout.includes("search") && !this.listLayout.includes("menu"));
    },
    // 表格操作菜单列表
    tableMenu() {
      const menuInfo = {
        preview: "查看",
        edit: "编辑",
        delete: "删除",
      };
      let _f = () => 1;
      let tableMenu = this.operaInfo.map((item) => {
        switch (Object.prototype.toString.call(item)) {
          case "[object String]":
            return { label: menuInfo[item], name: item, f: _f };
          case "[object Array]":
            const [name, f] = item;
            return { label: menuInfo[name], name, f: f == undefined ? _f : f };
          case "[object Object]":
            return { ...item, f: item.verify == undefined ? _f : item.verify };
          default:
            return "";
        }
      });
      return tableMenu;
    },
  },
  mounted() {
    this.initDat();
  },
  methods: {
    initDat() {
      // 因为缓存列表size的需求，从缓存中取pageInfo的size
      // 不用在公共组件初始化调用请求数据接口的路由路径
      let hideRouter = ["/yq-personnel/medicalMonitor", "/sys-manage/dictionary", "/yq-personnel/checkIn", "/index"];
      if (hideRouter.includes(this.$route.path)) {
        return;
      }
      this.initList({ size: Number(localStorage.getItem("pageSize")) || 10 });
    },
    //切换列表勾选状态
    toggleSelection(row = {}) {
      if (Object.getOwnPropertyNames(row).length !== 0) {
        this.$refs.multipleTable.toggleRowSelection(row);
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    changsort(column) {
      this.dataInfo.forEach((item) => {
        if (item.asc != null) item.asc = null;
      });
      this.dataInfo.forEach((item) => {
        if (item.prop == column.prop) {
          console.log(column.order);
          item.sortable = "custom";
          column.order == "descending" ? (item.asc = false) : (item.asc = true);
        }
      });
      this.handleFilter();
    },
    // 联动筛选项可选值获取
    setLinkFilterOptions() {
      let linkFilterOptions = {};
      this.filterList.forEach((item) => {
        if (!!item.linkName) {
          let linkFilterInput = this.filterList.find((i) => i.name === item.linkName);
          if (linkFilterInput) {
            linkFilterOptions[item.linkName] = linkFilterInput.children || this.getDict(linkFilterInput.dictName) || [];
          }
        }
      });
      this.linkFilterOptions = linkFilterOptions;
    },
    // 联动筛选项改变监听
    handleLinkFilterChange({ name, value }) {
      let filterItem = this.filterList.find((i) => i.name === name);
      let filterItemIndex = this.filterList.findIndex((i) => i.name === name);
      let linkFilter = this.filterList.find((i) => i.linkName === name)?.linkFunction;
      let newList = linkFilter ? linkFilter({ list: filterItem.children, value }) : filterItem.children.filter((i) => i.value.includes(value));
      this.linkFilterOptions[name] = newList;
      let ref = this.$refs[`${item.name}`][0];
      !["[]", ""].includes(JSON.stringify(ref.filterValue)) && ref.clear();
    },
    // 筛选参数回显
    echoParams(params = {}) {
      // 提取出页码、搜索关键词等内容单独处理
      let anotherParams = new Map();
      // 非区间筛选参数name <Array>
      let filterParamsName = [];
      // 区间筛选参数name <Array>
      let filterRangeParamsName = [];
      // 区间筛选列表name另一半匹配
      let filterRangeParams = [];
      this.filterList.forEach((i) => {
        if (typeof i.name === "string") {
          filterParamsName.push(i.name);
        } else {
          filterRangeParamsName.push(...i.name);
          filterRangeParams.push({
            start: i.name[0],
            end: i.name[1],
          });
        }
      });
      for (const k in params) {
        if (k === this.searchName) {
          this.searchValue = params[k];
        } else if (filterParamsName.includes(k)) {
          // 过滤空值
          const canPush = Object.prototype.toString.call(params[k]) === "[object Array]" ? !!params[k].length : !!params[k];
          canPush && anotherParams.set(k, params[k]);
        } else if (filterRangeParamsName.includes(k)) {
          let item = filterRangeParams.find((i) => i.start === k || i.end === k);
          let lastKey;
          let lastValue;
          if (item.start === k) {
            lastKey = [k, item.end];
            lastValue = [params[k], params[item.end]];
            delete params[item.end];
          } else {
            lastKey = [item.start, k];
            lastValue = [params[item.start], params[k]];
            delete params[item.start];
          }
          // 空值判断
          lastValue[0] !== "" && lastValue[1] !== "" && anotherParams.set(lastKey, lastValue);
        }
      }
      anotherParams.size && this.setFilter(anotherParams);
    },
    // 手动设置默认筛选项
    setFilter(map = new Map()) {
      if (!map.size) return;
      let formData = {};
      let choosedFilterList = [];
      map.forEach((value, key) => {
        let filterItem = this.filterData.find((_) => JSON.stringify(_.name) == JSON.stringify(key));
        //检测传值的正确性
        let isMultiple = ["datetimerange", "daterange", "numberRange", "checkbox"].includes(filterItem.inputType) || filterItem.multiple;
        if (isMultiple && Object.prototype.toString.call(value) !== "[object Array]") {
          console.error(`筛选项${key}默认值必须为数组类型`);
          return;
        }
        if (filterItem) {
          // 因为是预设值，所以日期和数字区间可以放在一块,把数字区间的预设值调整为数组
          if (["datetimerange", "daterange", "numberRange"].includes(filterItem.inputType) && Array.isArray(filterItem.name)) {
            const [startName, endName] = filterItem.name;
            const [startValue, endValue] = value;
            formData[startName] = startValue;
            formData[endName] = endValue;
          } else {
            formData[filterItem.name] = value;
          }
          // choosedFilterList.push({
          //   ...filterItem,
          //   inputType: ["checkbox", "radio"].includes(filterItem.inputType) ? "select" : filterItem.inputType,
          //   value: value,
          //   multiple: filterItem.inputType == "checkbox" ? true : !!filterItem.multiple,
          // });
        }
      });
      this.formData = formData;
      // this.choosedFilterList = choosedFilterList;
    },
    // 条件筛选
    handleFilter() {
      let formData = {};
      let validate = true;
      this.filterData.forEach((item, index) => {
        let ref = this.$refs[`${item.name}`][0];

        if (ref.filterValue !== ""&&ref.filterValue) {
          // 筛选项日期区间处理
          if (["datetimerange", "daterange"].includes(ref.inputType) && Array.isArray(ref.name)) {
            const [startName, endName] = ref.name;
            const [startTime, endTime] = ref.filterValue||['',''];
            formData[startName] = startTime;
            formData[endName] = endTime;
          } else if (["numberRange"].includes(ref.inputType) && Array.isArray(ref.name)) {
            const { valid, form } = ref.getFormData();
            const [startName, endName] = ref.name;
            const { min, max } = form;
            formData[startName] = min;
            formData[endName] = max;
            validate = valid;
          } else {
            formData[ref.name] = ref.filterValue;
          }
        }
      });
      // 数值区间校验
      if (!validate) return;
      // 重置逻辑处理
      Object.keys(this.formData).forEach((item) => {
        if (formData[item] == undefined) {
          formData[item] = "";
        }
      });

      this.formData = JSON.parse(JSON.stringify(formData));
      const arr = this.dataInfo.filter((val) => {
        return val.asc != null && val.asc != undefined;
      });
      const newArr = arr.map((item) => {
        return {
          column: item.prop,
          asc: item.asc,
        };
      });
      // 排序
      if (newArr.length > 0) {
        formData.orders = newArr;
      } else {
        delete formData.orders;
      }
      this.popVisible = false;
      this.initList({ current: 1, ...formData });
    },
    // 重置筛选
    resetFilter() {
      let formData = {};
      this.filterData.forEach((item, index) => {
        let ref = this.$refs[`${item.name}`][0];
        ref.clear();
        if (["datetimerange", "daterange", "numberRange"].includes(ref.inputType) && Array.isArray(ref.name)) {
          const [startName, endName] = ref.name;
          formData[startName] = "";
          formData[endName] = "";
        } else {
          formData[ref.name] = ref.multiple || ref.inputType == "checkbox" ? [] : "";
        }
      });

      this.popVisible = false;
      this.$emit("resetFilter");
      this.initList({ current: 1, ...formData });
    },
    // 关键词搜索
    searchByKeywords(searchValue) {
      if (!this.searchName) {
        throw Error("搜索关键词不存在");
      } else {
        this.initList({
          current: 1,
          size: this.pageInfo.size,
          [this.searchName]: searchValue,
        });
      }
    },
    // 修改当前页
    changeCurrentPage(current) {
      this.initList({ current });
    },
    // 修改单页条数
    changePageSize(size) {
      localStorage.setItem("pageSize", size);
      this.initList({ current: 1, size });
    },
    // 清空数据
    handleClear() {
      // this.initList({ current: 1, [this.searchName]: "" });
    },
    // 菜单按钮点击事件
    menuClick(item) {
      item.name === "delete" && this.selectData.length == 0 ? this.$alert("请勾选要删除的数据！") : this.$emit("menu-click", item.name);
    },
    // 表格菜单点击事件
    handleBtnClick(type, row) {
      this.$emit("btn-click", { type, row });
    },
    // 监听勾选
    handleSelect(arr) {
      this.$emit("selection-change", arr);
    },
    // 勾选所有监听
    selectAll(arr) {
      this.$emit("select-all", arr);
    },
    // 监听勾选变更
    selectChange(selection, row) {
      this.$emit("select", selection, row);
    },
    // 获取索引值
    getIndex(index) {
      const { current = 0, size = 0 } = this.pageInfo;
      return (current - 1) * size + (index + 1);
    },
    // 列表操作勾选
    toggleRowSelection(rows) {
      if (rows && rows.length) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
  },
};
</script>

<style lang="scss">
.dataList {
  padding-top: 24px;
  &.smallPadding {
    padding-top: 10px;
  }
  &.noPadding {
    padding-top: 0;
  }
  .listTop {
    margin-bottom: 32px;
  }
  .listPageInfo {
    margin-top: 10px;
  }
  .searchPanel {
    .el-input {
      width: 350px;
    }
    .el-input-group__append {
      background-color: #2f54eb;
      color: #fff;
      font-weight: normal;
      &:hover,
      &:focus {
        background-color: #5976ef;
      }
    }
  }
  .filterBtn {
    position: relative;
    color: #666;
    z-index: 999;
  }
  .btnList {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .flex-full {
    flex: 1;
  }
  .listFilter {
    width: 100%;
  }
  .chooseFilter {
    padding-bottom: 20px;
  }
  .cfilterRight {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .searchPanel {
      margin-right: 10px;
    }
  }
  .chooseFilter {
    /deep/ .el-row {
      .el-col {
        margin-bottom: 16px;
      }
      .lastCol {
        float: right;
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
      }
    }
  }
  /deep/ .el-date-editor .el-range-separator {
    min-width: 18px;
  }
  /deep/ .el-table__fixed-right {
    height: 100% !important; //设置高优先，以覆盖内联样式
  }

  /deep/ .el-table__fixed {
    height: 100% !important; //设置高优先，以覆盖内联样式
  }

  /deep/.el-table {
    tr.el-table__row td:last-child {
      .cell {
        .el-button {
          padding-top: 0;
          padding-bottom: 0;
          font-size: 14px;
        }
        // height: 23px;
        line-height: 23px;
      }
    }
  }
  .el-table {
    ::-webkit-scrollbar {
      background-color: #e1e1e1;
    }
  }
}
</style>

<style lang="scss" scoped>
.cFilterListWrap {
  /deep/ .filterList {
    li {
      margin-bottom: 10px;
    }
  }
  .operaBtn {
    border-top: 1px solid #ebeef5;
    padding-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
/deep/.tagLsit {
  border-radius: 7px;
  padding: 0 5px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  border: 2px solid;
  overflow: hidden;
  .iconfont {
    font-size: 22px;
    margin-right: 5px;
  }
}

.ordinary {
  color: blue;
  background-color: #f2f4fe;
}
.focus {
  background-color: #fcf2fc;
  color: purple;
}
.follow {
  color: orange;
  background-color: #fff5ee;
}
.diagnose {
  background-color: #ffeded;
  color: red;
}
</style>
