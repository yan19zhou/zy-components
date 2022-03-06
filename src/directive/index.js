import Vue from "vue";
import onlyNumber from "./onlyNumber";
import scrollBar from "./scrollBar";
import throttle from "./throttle";
import halfCharCode from "./halfCharCode";
import dialogDrag from "./dialogDrag";
import fullScreen from "./fullScreen";

// 区域滚动条
Vue.use(scrollBar);
// 数字小数输入限制
Vue.use(onlyNumber);
// 事件节流
Vue.use(throttle);
// 全角字符转半角
Vue.use(halfCharCode);
// 弹窗可拖拽可缩放
Vue.use(dialogDrag);
// 全屏
Vue.use(fullScreen);
