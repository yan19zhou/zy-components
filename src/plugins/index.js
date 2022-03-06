import Vue from "vue";
import Validator from "vue-validator";
import htmlToPdf from "@/plugins/htmlToPdf";
import axios from "@/plugins/axios";
import { formatThousandMoney } from "@/utils";

import "@/plugins/element.js";
import "@/assets/js/filter";
import "@/assets/js/proto";
import "@/assets/js/dialog";

Vue.use(htmlToPdf);
Vue.use(Validator);
Vue.prototype.http = axios;
// 日期格式化
Vue.prototype.dateFormatter = (row, column, cellValue) => {
	return cellValue ? cellValue.split(" ")[0] : cellValue;
};
// 金额格式化
Vue.prototype.priceFormatter = (row, column, cellValue) => {
	return cellValue == 0 ? cellValue : formatThousandMoney(cellValue, 2);
};
