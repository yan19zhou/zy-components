import { getDict } from "@/utils";
import request from "@/plugins/axios";
import { Message } from "element-ui";

export function extractName(type, key) {
  if (getDict(type).length <= 0) return "";
  if (!key) return;
  const arr = getDict(type).filter((item) => {
    return item.value === key;
  });
  if (arr.length <= 0) return;
  return arr[0].label;
}

// 转为搜索数组为对象
export function conversion(data) {
  const obj = {};
  data.forEach((item) => {
    // 数组多选 传递 ","
    if (Array.isArray(item.value) && item.multiple) {
      obj[item.key] = item.value.join(",");
    } else {
      obj[item.key] = item.value;
    }
    if (Array.isArray(item.extraObj)) {
      item.extraObj.forEach((val) => {
        obj[val.key] = val.value;
      });
    }
    if (item.extraObj && item.extraObj instanceof Object) {
      obj[item.extraObj.key] = item.extraObj.value;
      if (item.extraObj.extraObj) {
        obj[item.extraObj.extraObj.key] = item.extraObj.extraObj.value;
      }
    }
  });
  return obj;
}

// 为数组赋值
export function reversalData(arr, database) {
  if (!database) return;
  arr.forEach((item) => {
    if (database[item.key]) {
      item.value = database[item.key];
    }
    if (Array.isArray(item.extraObj)) {
      item.extraObj.forEach((val) => {
        val.value = database[val.key];
      });
    }

    if (item.extraObj && item.extraObj instanceof Object) {
      if (database[item.extraObj.key]) {
        item.extraObj.value = database[item.extraObj.key];
      }
    }

    if (item.extraObj && item.extraObj.extraObj) {
      if (database[item.extraObj.extraObj.key]) {
        item.extraObj.extraObj.value = database[item.extraObj.extraObj.key];
      }
    }
  });
}

export function nowDate() {
  const time = new Date();
  const timeNow = `${time.getFullYear()}-${addzero(time.getMonth() + 1)}-${addzero(time.getDate())} ${addzero(time.getHours())}:${addzero(time.getMinutes())}:${addzero(time.getSeconds())}`;
  return timeNow;
}

// 回退两小时
export function rollbacktwo(data) {
  const time = new Date(data);
  const timeNow = `${time.getFullYear()}-${addzero(time.getMonth() + 1)}-${addzero(time.getDate())} ${addzero(time.getHours() - 2)}:${addzero(time.getMinutes())}:${addzero(time.getSeconds())}`;
  return timeNow;
}
// 加零
function addzero(val) {
  if (val < 10) {
    return `0${val}`;
  }
  return val;
}

export function watermark(leftWidth = 70, topWidth = 0, title, idr) {
  console.log("触发");
  let watermark = {};
  let setWatermark = (str) => {
    let id = idr;
    let can = document.createElement("canvas");
    can.width = 400;
    can.height = 350;
    let cans = can.getContext("2d");
    cans.rotate((-20 * Math.PI) / 180);
    cans.font = "20px Vedana";
    cans.fillStyle = "rgba(218, 216, 216)";
    cans.textAlign = "left";
    cans.textBaseline = "Middle";
    cans.fillText(str, can.width / 2, can.height / 2);
    let div = document.createElement("div");
    div.id = id;
    div.style.pointerEvents = "none";
    div.style.top = topWidth + "px";
    div.style.left = leftWidth + "px";
    div.style.position = "fixed";
    div.style.zIndex = "100000";
    div.style.width = document.documentElement.clientWidth + "px";
    div.style.height = document.documentElement.clientHeight + "px";
    div.style.opacity = 0.2; //水印透明度
    div.style.background = `url( ${can.toDataURL("image/png")}) left top repeat`;
    document.body.appendChild(div);
    return id;
  };

  // 该方法只允许调用一次
  watermark.set = (str) => {
    let id = setWatermark(str);
    if (document.getElementById(id) === null) {
      id = setWatermark(str);
    }
    window.onresize = () => {
      setWatermark(str);
    };
  };
  watermark.set(title);
}

export function removeWatermark(idr) {
  if (document.getElementById(idr) !== null) {
    document.body.removeChild(document.getElementById(idr));
  }
}

export function getInfoByCardId(cardId) {
  let grender, birth, age;
  //获取出生日期
  birth = cardId.substring(6, 10) + "-" + cardId.substring(10, 12) + "-" + cardId.substring(12, 14);
  //获取性别
  if (parseInt(cardId.substr(16, 1)) % 2 == 1) {
    grender = "1";
  } else {
    grender = "0";
  }
  //获取年龄
  var myDate = new Date();
  var month = myDate.getMonth() + 1;
  var day = myDate.getDate();
  age = myDate.getFullYear() - cardId.substring(6, 10) - 1;
  if (cardId.substring(10, 12) < month || (cardId.substring(10, 12) == month && cardId.substring(12, 14) <= day)) {
    age++;
  }
  if (age > 100 || age < -1) {
    Message.error({ message: "请检查身份证号码是否正确" });
    age = 0;
  }

  return { grender, birth, age };
}
