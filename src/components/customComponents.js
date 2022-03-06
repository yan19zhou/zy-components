/*
 * @Description: 自定义组件注册
 * @Author: zhouy
 * @Date: 2021-10-11 10:39:05
 * @LastEditTime: 2021-11-03 16:20:14
 * @LastEditors: zhouy
 */
import Vue from "vue";
// 导入项目基础组件
const requireComponent = require.context("../components", true, /c-\w+\.(vue)$/);

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName);
  const com = componentConfig.default || componentConfig;
  const name = fileName
    .split("/")
    .pop()
    .replace(/\.\w+$/, "");
  Vue.component(name, com);
});

/* 因为只需要表单组件 所以单独导入 */
import Uinput from "@/uview-ui/components/u-input/u-input.vue";
import Ufield from "@/uview-ui/components/u-field/u-field.vue";
import Upicker from "@/uview-ui/components/u-picker/u-picker.vue";
import Urate from "@/uview-ui/components/u-rate/u-rate.vue";
import Unumberbox from "@/uview-ui/components/u-number-box/u-number-box.vue";
import Uupload from "@/uview-ui/components/u-upload/u-upload.vue";
import Ucheckbox from "@/uview-ui/components/u-checkbox/u-checkbox.vue";
import Uswitch from "@/uview-ui/components/u-switch/u-switch.vue";

const components = [Uinput, Ufield, Upicker, Urate, Unumberbox, Uupload, Ucheckbox, Uswitch];

const customComponents = {
  install: app => {
    [].concat(components).forEach(item => {
      app.component(item.name, item);
    });
  },
};

export default customComponents;
