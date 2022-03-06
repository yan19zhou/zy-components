"use strict";

import Vue from "vue";
import axios from "axios";
import dbl from "@/utils/dbl";
import store from "../store";
import { MessageBox, Message } from "element-ui";
import qs from "qs";
import router from "@/router";
// 请求前缀
const prefix = process.env.VUE_APP_PREFIX;

let config = {
  // baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 60 * 1000 * 2, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

let reqList = [];

/**
 * 允许某个请求可以继续进行
 * @param {array} reqList 全部请求列表
 * @param {string} url 请求地址
 */
const allowRequest = function(reqList, url) {
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url) {
      reqList.splice(i, 1);
      break;
    }
  }
};
const errorMsg = (error) => {
  Vue.prototype.$message({
    customClass: "systemMessage",
    duration: "2000",
    showClose: true,
    message: error && error.length <= 100 ? error : "系统错误，请联系管理员",
    type: "error",
  });
};

const repectMsg = (error) => {
  Vue.prototype.$message({
    customClass: "systemMessage",
    duration: "2000",
    showClose: true,
    message: "请勿重复提交!",
    type: "warning",
  });
};
/* 
遮罩
*/
let loading;
function startLoading() {
  loading = Vue.prototype.$loading({
    lock: true,
    text: "拼命读取中",
    customClass: "global-loading",
  });
}
function endLoading() {
  if (loading) {
    loading.close();
  }
}
//递归判断数据类型
function deepType(query) {
  let obj = {};
  switch (Object.prototype.toString.call(query)) {
    case "[object Array]":
      return query.map((e) => deepType(e));
    case "[object Object]":
      for (let key in query) {
        obj[key] = deepType(query[key]);
      }
      return obj;
    case "[object String]":
      return query.trim();
    default:
      return query;
  }
}
//请求参数前后去空格处理
function formatterParams(config) {
  if (config.method === "get") {
    config.params = deepType(config.params);
  } else if (["post", "put"].includes(config.method)) {
    config.data = deepType(config.data);
  }
  return config;
}

let is401 = false;

const _axios = axios.create(config);

_axios.interceptors.request.use(
  async (config) => {
    startLoading();
    let cancel;
    // 设置cancelToken对象
    config.cancelToken = new axios.CancelToken(function(c) {
      cancel = c;
    });
    let token = dbl.get("token");
    let url = config.url;
    // api2都是新加的环境房间物品的接口，和中科不再一个服务下面，所以用ajax代替
    if (url.indexOf("/apis") < 0) {
      url = `${prefix}${config.url}`;
    }
    if (token && url !== "/auth/code" && url !== "/auth/login") {
      config.headers["Authorization"] = token;
    } else {
      delete config.headers["Authorization"];
    }

    if (config.method === "get") {
      config.paramsSerializer = function(params) {
        // 删除空字符串
        for (let item in params) {
          if (!params[item]) {
            delete params[item];
          }
        }
        return qs.stringify(params, { arrayFormat: "repeat" });
      };
      config.data = qs.stringify(config.data);
    }

    // 这里加这个判断，主要是为了在get请求下，可以穿json
    config.headers["Content-Type"] = config.formData ? "application/x-www-form-urlencoded" : "application/json";
    config.url = url;
    return formatterParams(config);
  },
  async (error) => {
    // Do something with request error
    endLoading();
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    endLoading();
    // 增加延迟，相同请求不得在短时间内重复发送
    response.config.methods == "post" &&
      setTimeout(() => {
        allowRequest(reqList, response.config.url);
      }, 1000);

    const code = response.status;
    if (code < 200 || code > 300) {
      errorMsg(response.data.msg);
      return Promise.reject("error");
    } else {
      if (response.data.code === 1) {
        errorMsg(response.data.msg);
        return response;
      } else {
        return response;
      }
    }
  },
  function(error) {
    endLoading();
    if(error.response.data.msg) {errorMsg(error.response.data.msg);}
    Vue.prototype.$message.closeAll();
    if (axios.isCancel(error)) {
      console.log(error);
    } else {
      // 增加延迟，相同请求不得在短时间内重复发送
      //setTimeout(() => { allowRequest(reqList, error.config.url)}, 1000)
    }

    let code = error.response ? error.response.status : "";

    if (error.toString().indexOf("Error: timeout") !== -1) {
      errorMsg("网络请求超时");
      return Promise.reject(error);
    }

    if ([401].includes(code)) {
      let currentRoute = router.currentRoute.path;
      ["/", "/login"].includes(currentRoute) && (is401 = true);
      if (!is401) {
        is401 = true;
        MessageBox.alert("登录状态已过期，您可以继续留在该页面，或者重新登录", "系统提示", {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            //缓存掉线前最后的页面，登录后优先跳转
            localStorage.setItem("lastUrl", window.location.pathname + window.location.search);
            store.dispatch("LogOut");
          })
          .catch(() => {
            is401 = false;
          });
      } else {
        router.replace("/login");
      }
    } else if (code == 403) {
      router.replace("/error403");
    } else if (code == 405) {
      repectMsg(error);
    } else {
      // errorMsg(error.response ? error.response.data.msg +code: "");
      errorMsg("系统错误（" + code + "），请联系管理员！")
    }
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue) {
  Vue.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      },
    },
  });
};

Vue.use(Plugin);

export default _axios;
