// Created by lifei on 2020/6/2--15:23.
import request from "@/plugins/axios";
import store from "~/store/index";
import { Message } from "element-ui";

// 下载资源
export const downloadBlob = (data, fileName) => {
	let blob = new Blob([data]);
	if ("download" in document.createElement("a")) {
		// 不是IE浏览器
		let url = window.URL.createObjectURL(blob);
		let link = document.createElement("a");
		link.style.display = "none";
		link.href = url;
		link.setAttribute("download", fileName);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link); // 下载完成移除元素
		window.URL.revokeObjectURL(url); // 释放掉blob对象
	} else {
		// IE 10+
		window.navigator.msSaveBlob(blob, fileName);
	}
};

// 获取图片地址
export const getPic = url => {
	return new Promise((resolve, reject) => {
		request({
			url: url,
			method: "get",
			responseType: "blob"
		})
			.then(resp => {
				resolve(window.URL.createObjectURL(resp.data));
			})
			.catch(() => {
				resolve("");
			});
	});
};

/**
 * 根据字典名称获取字典项
 * @param {String} typeName
 */
export const getDict = function(typeName) {
	let data = store.state.dict.find(item => item.type === typeName) || {};
	return data.children || [];
};

/**
 * 带上请选择返回字典列表
 * @param {String} typeName 字典键名
 */
export const getDictAndPlease = function(typeName) {
	let data = store.state.dict.find(item => item.type === typeName) || {};
	// let please = {
	//     label: "-=请选择=-",
	//     value: -1
	// }

	let tempData = data.children.concat();

	/*if((tempData != undefined || tempData != null || tempData.length != 0) && tempData[0].value != '-1'){
        tempData.unshift(please)
    }*/

	return tempData || [];
};

/**
 * 根据权限键名获取权限
 * @param {String} key 权限键名
 */
export const getPermissions = key => {
	const roles = store.state.user.roles || {};
	return roles[key] || false;
};

/**
 * 处理可编辑表格校验
 * @param data
 * @param editTableRules
 * @returns {Promise<unknown>}
 */
export function validateEditTable(data, editTableRules) {
	return new Promise((resolve, reject) => {
		let msg = "";
		Object.keys(data).map((key, index) => {
			editTableRules.map(rules => {
				if (rules.attribute === key) {
					if (data[key] instanceof Array) {
						if (data[key].length > 0) {
							for (let i = 0; i < data[key].length; i++) {
								if (
									data[key][i] === "" ||
									data[key][i] === null ||
									data[key][i] === undefined
								) {
									msg += `<p>${rules.label}不能为空！</p>`;
									break;
								}
							}
						} else {
							msg += `<p>${rules.label}不能为空！</p>`;
						}
					} else if (
						data[key] === "" ||
						data[key] === null ||
						data[key] === undefined
					) {
						msg += `<p>${rules.label}不能为空！</p>`;
					}
				}
			});
		});
		setTimeout(function() {
			if (msg.length > 0) {
				console.log("11", data);
				Message.error({ dangerouslyUseHTMLString: true, message: msg });
				resolve(false);
			} else {
				resolve(true);
			}
		}, 100);
	});
}

/**
 * 属性赋值
 * @param target 目标对象
 * @param source 源对象
 */
export function setProperty(target, source) {
	for (let i of Object.keys(target)) {
		target[i] = source[i];
	}
	return target;
}

/**
 * 精确计算
 */
export const calc = {
	/*
			函数，加法函数，用来得到精确的加法结果  
			说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
			参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
			调用：Calc.Add(arg1,arg2,d)  
			返回值：两数相加的结果
			*/
	Add: function(arg1, arg2) {
		(arg1 = arg1.toString()), (arg2 = arg2.toString());
		var arg1Arr = arg1.split("."),
			arg2Arr = arg2.split("."),
			d1 = arg1Arr.length == 2 ? arg1Arr[1] : "",
			d2 = arg2Arr.length == 2 ? arg2Arr[1] : "";
		var maxLen = Math.max(d1.length, d2.length);
		var m = Math.pow(10, maxLen);
		var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
		var d = arguments[2];
		return typeof d === "number" ? Number(result.toFixed(d)) : result;
	},
	/*
			函数：减法函数，用来得到精确的减法结果  
			说明：函数返回较为精确的减法结果。 
			参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数
			调用：Calc.Sub(arg1,arg2)  
			返回值：两数相减的结果
			*/
	Sub: function(arg1, arg2) {
		return calc.Add(arg1, -Number(arg2), arguments[2]);
	},
	/*
			函数：乘法函数，用来得到精确的乘法结果  
			说明：函数返回较为精确的乘法结果。 
			参数：arg1：第一个乘数；arg2第二个乘数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
			调用：Calc.Mul(arg1,arg2)  
			返回值：两数相乘的结果
			*/
	Mul: function(arg1, arg2) {
		var r1 = arg1.toString(),
			r2 = arg2.toString(),
			m,
			resultVal,
			d = arguments[2];
		m =
			(r1.split(".")[1] ? r1.split(".")[1].length : 0) +
			(r2.split(".")[1] ? r2.split(".")[1].length : 0);
		resultVal =
			(Number(r1.replace(".", "")) * Number(r2.replace(".", ""))) /
			Math.pow(10, m);
		return typeof d !== "number"
			? Number(resultVal)
			: Number(resultVal.toFixed(parseInt(d)));
	},
	/*
			函数：除法函数，用来得到精确的除法结果  
			说明：函数返回较为精确的除法结果。 
			参数：arg1：除数；arg2被除数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
			调用：Calc.Div(arg1,arg2)  
			返回值：arg1除于arg2的结果
			*/
	Div: function(arg1, arg2) {
		var r1 = arg1.toString(),
			r2 = arg2.toString(),
			m,
			resultVal,
			d = arguments[2];
		m =
			(r2.split(".")[1] ? r2.split(".")[1].length : 0) -
			(r1.split(".")[1] ? r1.split(".")[1].length : 0);
		resultVal =
			(Number(r1.replace(".", "")) / Number(r2.replace(".", ""))) *
			Math.pow(10, m);
		return typeof d !== "number"
			? Number(resultVal)
			: Number(resultVal.toFixed(parseInt(d)));
	}
};

/**
 * 全角字符转半角
 * @param {str} str
 */
export function ToCDB(str) {
	var tmp = "";
	for (var i = 0; i < str.length; i++) {
		if (str.charCodeAt(i) == 12288) {
			tmp += String.fromCharCode(str.charCodeAt(i) - 12256);
			continue;
		}
		if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
			tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
		} else {
			tmp += String.fromCharCode(str.charCodeAt(i));
		}
	}
	return tmp;
}

/*
 * 根据某个字段实现对json数组的排序
 * @param array  要排序的json数组对象
 * @param field  排序字段（此参数必须为字符串）
 * @param reverse 是否倒序（默认为false）
 * @return array  返回排序后的json数组
 */
export function jsonSort(array, field, reverse) {
	//数组长度小于2 或 没有指定排序字段 或 不是json格式数据
	if (array.length < 2 || !field || typeof array[0] !== "object") return array;
	//数字类型排序
	if (typeof array[0][field] === "number") {
		array.sort(function(x, y) {
			return x[field] - y[field];
		});
	}
	//字符串类型排序
	if (typeof array[0][field] === "string") {
		array.sort(function(x, y) {
			return x[field].localeCompare(y[field]);
		});
	}
	//倒序
	if (reverse) {
		array.reverse();
	}
	return array;
}

/**
 * 格式化金额，整数的话直接返回，不是整数返回两位小数
 * @param {String|Number} num 金额
 */
export const formatMoney = num => {
	let newNum = typeof num === "number" ? num : Number(num);
	return String(newNum).indexOf(".") > 0 ? newNum.toFixed(2) : newNum;
};

/**
 * @description 千本位格式化金额
 * @param number：要格式化的数字
 * @param decimals：保留几位小数 默认2位
 * @param decPoint：小数点符号 默认.
 * @param thousandsSep：千分位符号 默认为,
 */
export function formatThousandMoney(
	number,
	decimals = 2,
	decPoint = ".",
	thousandsSep = ","
) {
	number = (number + "").replace(/[^0-9+-Ee.]/g, "");
	let n = !isFinite(+number) ? 0 : +number;
	let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
	let sep = typeof thousandsSep === "undefined" ? "," : thousandsSep;
	let dec = typeof decPoint === "undefined" ? "." : decPoint;
	let s = "";
	let toFixedFix = function(n, prec) {
		let k = Math.pow(10, prec);
		return "" + ((n * k) / k);
	};
	s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
	let re = /(-?\d+)(\d{3})/;
	while (re.test(s[0])) {
		s[0] = s[0].replace(re, "$1" + sep + "$2");
	}
	if ((s[1] || "").length < prec) {
		s[1] = s[1] || "";
		s[1] += new Array(prec - s[1].length + 1).join("0");
	}
	return s.join(dec);
}

/**
 * @description 对象数组按照某个属性排序
 * @param arr: 数组
 * @param property: 属性
 * @param type: 升序和降序，0-降序，1-升序
 */
export function mySort(arr, property, type) {
  function compare(property) {
    return function(a,b){
      let value1 = a[property];
      let value2 = b[property];
      return type ? value1-value2 : value2-value1;
    }
  }
  return arr.sort(compare(property))
}


export function mySortByDate (arr, property, type) {
	function compare(property) {
		return function(a,b){
		  let value1 = new Date(a[property]);
		  let value2 = new Date(b[property]);
		  return type ? value1-value2 : value2-value1;
		}
	  }
	  return arr.sort(compare(property))
}

export default {
	getDict
};
