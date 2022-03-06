import CryptoJS from "crypto-js";

const rclass = /[\t\r\n\f]/g;

export function getClass(elem) {
  return (elem.getAttribute && elem.getAttribute("class")) || "";
}
export function hasClass(elem, selector) {
  let className;
  className = ` ${selector} `;
  if (elem.nodeType === 1 && ` ${this.getClass(elem)} `.replace(rclass, " ").indexOf(className) > -1) {
    return true;
  }
  return false;
}
export function removeblank(obj) {
  for (let item in obj) {
    let curAttr = obj[item];
    if (typeof curAttr === "string") {
      obj[item] = curAttr.trim();
    }
  }
  return obj;
}
// 通用数据处理,将对象中的属性取到表单
export function getParamFromObject(param, object) {
  var ret = Object.assign({}, param, object);
  for (var key in ret) {
    if (!(key in param)) delete ret[key];
  }
  return ret;
}
// 将表单中的数据存入对象中
export function setDataInObject(data, object) {
  var ret = Object.assign({}, object, data);
  for (var key in ret) {
    if (!(key in object)) delete ret[key];
  }
  return ret;
}
//获取url中hash的参数方法
export function getHashUrlParam(name) {
  const url = window.location.hash; //获取url中"?"符后的字串
  if (url.indexOf("?") != -1) {
    let str = url.split("?")[1];
    let strs = str.split("&");
    for (let i = 0; i < strs.length; i++) {
      if (decodeURIComponent(strs[i].split("=")[0]) == name) {
        return unescape(strs[i].split("=")[1]);
      }
    }
  }
  return null;
}
//获取url中的参数方法
export function getUrlParams(url, sArgName) {
  url = url == null ? window.location.href : url;
  var args = url.split("?");
  var retval = "";
  if (args[0] == url) {
    /*参数为空*/ return retval; /*无需做任何处理*/
  }
  var str = args[1].split("#")[0];
  args = str.split("&");
  for (var i = 0; i < args.length; i++) {
    str = args[i];
    var arg = str.split("=");
    if (arg.length <= 1) continue;
    if (arg[0] == sArgName) {
      retval = arg[1];
      return retval;
    }
  }
  return retval;
}
// 加密方法
export function pwdEncrypt(word) {
  // 加密
  let keya = CryptoJS.enc.Utf8.parse("1234567887654321");
  let iva = CryptoJS.enc.Utf8.parse("1234567887654321");

  let srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, keya, {
    iv: iva,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  });
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}
// 解密方法
export function Decrypt(word) {
  let key = CryptoJS.enc.Utf8.parse("1234567887654321");
  let iv = CryptoJS.enc.Utf8.parse("1234567887654321");
  if (!word) return "";
  let decrypt = CryptoJS.AES.decrypt(word, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  });
  try {
    decrypt = CryptoJS.enc.Utf8.stringify(decrypt).toString();
  } catch (err) {
    console.log(err);
    decrypt = "";
  }
  return decrypt;
}
//防抖：
export function debounce(fn, wait = 500) {
  let timeout = null; // 创建一个标记用来存放定时器的返回值
  return function() {
    // 每当用户输入的时候把前一个 setTimeout clear 掉
    clearTimeout(timeout);
    // 然后又创建一个新的 setTimeout, 这样就能保证interval 间隔内如果时间持续触发，就不会执行 fn 函数
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, wait);
  };
}
//节流：
export function throttle(fn, wait = 500) {
  let canRun = true; // 通过闭包保存一个标记
  return function() {
    // 在函数开头判断标记是否为true，不为true则return
    if (!canRun) return;
    // 立即设置为false
    canRun = false;
    // 将外部传入的函数的执行放在setTimeout中
    setTimeout(() => {
      // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。
      // 当定时器没有执行的时候标记永远是false，在开头被return掉
      fn.apply(this, arguments);
      canRun = true;
    }, wait);
  };
}
// 重置对象数据
export function resetFormData(formDatas) {
  if (!formDatas) {
    formDatas = {};
  }
  for (var key in formDatas) {
    formDatas[key] = "";
  }
  return formDatas;
}
