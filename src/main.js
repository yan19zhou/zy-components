/*
 * @Description: 
 * @Author: zhouy
 * @Date: 2021-07-22 16:43:17
 * @LastEditTime: 2021-07-28 17:09:44
 * @LastEditors: zhouy
 */
import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import ElementUI from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
