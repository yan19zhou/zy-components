/**
 * element表单校验
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
	return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
	const valid_map = ["admin", "editor"];
	return valid_map.indexOf(str.trim()) >= 0;
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
	const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
	return reg.test(url);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
	const reg = /^[a-z]+$/;
	return reg.test(str);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
	const reg = /^[A-Z]+$/;
	return reg.test(str);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
	const reg = /^[A-Za-z]+$/;
	return reg.test(str);
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
	const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return reg.test(email);
}

export function isvalidPhone(phone) {
	const reg = /^1[23456789]\d{9}$/;
	return reg.test(phone);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
	if (typeof str === "string" || str instanceof String) {
		return true;
	}
	return false;
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
	if (typeof Array.isArray === "undefined") {
		return Object.prototype.toString.call(arg) === "[object Array]";
	}
	return Array.isArray(arg);
}

/**
 * 是否合法IP地址
 * @param rule
 * @param value
 * @param callback
 */
export function validateIP(rule, value, callback) {
	if (value === "" || value === undefined || value == null) {
		callback();
	} else {
		const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
		if (!reg.test(value) && value !== "") {
			callback(new Error("请输入正确的IP地址"));
		} else {
			callback();
		}
	}
}

/* 是否手机号码或者固话*/
export function validatePhoneTwo(rule, value, callback) {
	const reg = /^((0\d{2,3}[-,，]\d{7,8})|(1[23456789]\d{9}))$/;
	if (value === "" || value === undefined || value == null) {
		callback();
	} else {
		if (!reg.test(value) && value !== "") {
			callback(new Error("请输入正确的电话号码或者固话号码(0754-XXXXXXXX)"));
		} else {
			callback();
		}
	}
}

/* 是否固话*/
export function validateTelephone(rule, value, callback) {
	const reg = /0\d{2}-\d{7,8}/;
	if (value === "" || value === undefined || value == null) {
		callback();
	} else {
		if (!reg.test(value) && value !== "") {
			callback(new Error("请输入正确的固话（格式：区号+号码,如010-1234567）"));
		} else {
			callback();
		}
	}
}
/* 是否固定电话方式2*/
export function validateTel(rule, value, callback) {
	if (value === "") {
		callback(new Error("机构电话不可为空"));
	} else {
		if (value !== "") {
			var reg = /^((0\d{2,3}-\d{7,8})|(1[23456789]\d{9}))$/;
			if (!reg.test(value)) {
				callback(new Error("请输入正确的手机号或者座机号格式为：0000-0000000"));
			}
		}
		callback();
	}
}

/**
 * 联系电话验证，支持手机号、国内电话号码(0511-4405222、021-87888822)
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function validatePhone(rule, value, callback) {
	if (!value) {
		callback();
	}
	if (
		!/^((\d{11,12})|(\d{9})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d)|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d))$)$/.test(
			value
		)
	) {
		callback(new Error("请输入正确的联系电话"));
	} else {
		callback();
	}
}

/**
 *
 * 邮箱校验
 */
export function validateEmail(rule, value, callback) {
	const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (value === "" || value === undefined || value == null) {
		callback();
	} else {
		if (!reg.test(value) && value !== "") {
			callback(new Error("请输入正确的电子邮箱"));
		} else {
			callback();
		}
	}
}

/* 是否身份证号码*/
export function validateIdNo(rule, value, callback) {
	const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	if (value === "" || value === undefined || value == null) {
		callback();
	} else {
		if (!reg.test(value)) {
			callback(new Error("请输入正确的身份证号码"));
		} else {
      let birth = "";
			if (value.length === 15) {
				birth = "19" + value.substring(6, 8) + "-" + value.substring(8, 10) + "-" + value.substring(10, 12);
			} else if (value.length === 18) {
				birth = value.substring(6, 10) + "-" + value.substring(10, 12) + "-" + value.substring(12, 14);
			}
      if (isNaN(+new Date(birth)) || +new Date(birth) > +new Date()) {
        callback(new Error("请输入正确的身份证号码"));
      } else {
				callback();
			}
		}
	}
}

// 统一社会信用代码证
export function isSocialCredit(card) {
	let reg = /^[A-Za-z0-9]{18}$/;
	return reg.test(card);
}

// 税务登记证
export function isTaxAdministration(card) {
	let reg = /^([A-Z0-9]{15}|[A-Z0-9]{17}|[A-Z0-9]{20})$/;
	return reg.test(card);
}
// 组织机构代码证
export function isOrg(card) {
	let reg = /^[A-Za-z0-9]{9}$/;
	return reg.test(card);
}

/**
 * 判断是否为空
 */
export function validatenull(val) {
	if (typeof val === "boolean") {
		return false;
	}
	if (typeof val === "number") {
		return false;
	}
	if (val instanceof Array) {
		if (val.length == 0) return true;
	} else if (val instanceof Object) {
		if (JSON.stringify(val) === "{}") return true;
	} else {
		if (
			val == "null" ||
			val == null ||
			val == "undefined" ||
			val == undefined ||
			val == ""
		)
			return true;
		return false;
	}
	return false;
}

// 价格正则校验
export function priceValidate(value) {
	const reg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
	if (!reg.test(value) && value !== "") {
		callback(new Error("请输入正确的金额"));
	} else {
		callback();
	}
}

/**
 * 保留小数后两位，最大值为9999999999
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function doubleValidate(rule, value, callback) {
	if (!value) {
		callback();
	}
	let reg = /^(([1-9]\d*)|(0))(\.\d{1,2})?$/;
	if (!reg.test(value)) {
		return callback(new Error("数值格式错误（最多保留两位小数）"));
	} else {
		if (value > 99999999999) {
			return callback(new Error("最大值不超过99999999999"));
		} else {
			callback();
		}
	}
}

/**
 * 整数校验
 */
export function isInt(rule, value, callback) {
	const re = /^(0|[1-9][0-9]*)$/;
	const rsCheck = re.test(value);
	console.log(rsCheck);
	if (!rsCheck) {
		callback(new Error("请输入0或大于0的整数"));
	} else {
		if (value > 99999999999) {
			return callback(new Error("最大值不超过99999999999"));
		} else {
			callback();
		}
	}
}
export function isIntNotNeed(rule, value, callback) {
	if (!Number(value)) {
		callback();
	} else {
		const re = /^(0|[1-9][0-9]*)$/;
		const rsCheck = re.test(value);
		if (!rsCheck) {
			callback(new Error("请输入0或大于0的整数"));
		} else {
			if (value > 99999999999) {
				return callback(new Error("最大值不超过99999999999"));
			} else {
				callback();
			}
		}
	}
}

/*
 * 密码复杂度校验
 * */
export const validatePass = (rule, value, callback) => {
	if (!value) callback();
	let pwdRegex = new RegExp("(?=.*\\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()]).{6,15}");
	let re = /(\w)*(\w)\2{2}(\w)*/g;
	if (!pwdRegex.test(value)) {
		callback(
			new Error(
				"密码长度必须不少于6位,不大于15位，并且必须同时包含数字、字母、特殊字符（特殊字符包括（英文字符）：!@#$%^&*()）"
			)
		);
	} else if (!lxStr(value)) {
		callback(
			new Error("弱口令密码,不能连续字符（如123、abc、！@#）连续3位或3位以上")
		);
	} else if (re.test(value)) {
		callback(
			new Error("弱口令密码,不能相同字符（如111、aaa）连续3位或3位以上")
		);
	} else {
		callback();
	}
};
export function lxStr(str) {
	let arr = str.split("");
	let flag = true;
	for (let i = 1; i < arr.length - 1; i++) {
		let firstIndex = arr[i - 1].charCodeAt();
		let secondIndex = arr[i].charCodeAt();
		let thirdIndex = arr[i + 1].charCodeAt();
		thirdIndex - secondIndex == 1;
		secondIndex - firstIndex == 1;
		if (thirdIndex - secondIndex == 1 && secondIndex - firstIndex == 1) {
			flag = false;
		}
	}
	const strArr = [
		"!@#",
		"@#$",
		"#$%",
		"$%^",
		"%^&",
		"^&*",
		"&*(",
		"*()",
		")_+",
		"~!@"
	];
	for (let i = 0; i < strArr.length; i++) {
		if (str.indexOf(strArr[i]) != -1) {
			flag = false;
			break;
		}
	}
	return flag;
}

// 地图经纬度校验
export function mapVerification(rule, value, callback) {
	if (value === "" || value === null || value === undefined) {
		callback();
	} else {
		let a = value.split(",")[0];
		let b = value.split(",")[1];
		let regLeft = /^[\-\+]?(0?\d{1,2}\.\d{1,20}|1[0-7]?\d{1}\.\d{1,20}|180\.0{1,20})$/;
		let regRight = /^[\-\+]?([0-8]?\d{1}\.\d{1,20}|90\.0{1,20})$/;
		if (!regLeft.test(a)) {
			return callback(
				new Error("地图经度整数部分为0～180，必须输入1到20位小数！")
			);
		} else if (!regRight.test(b)) {
			return callback(
				new Error("地图纬度整数部分为0～90，必须输入1到20位小数！")
			);
		} else {
			callback();
		}
	}
}

// 统一社会信用代码证
export function validateSocialCredit(rule, value, callback) {
	if (!/^[A-Za-z0-9]{18}$/.test(value)) {
		return callback(new Error("请输入18位数字或字母的正确社会统一信用代码"));
	}
	callback();
}

// 数组对象去重
export function deleteObject(obj) {
	let uniques = [];
	let stringify = {};
	for (let i = 0; i < obj.length; i++) {
		let keys = Object.keys(obj[i]);
		keys.sort(function (a, b) {
			return (Number(a) - Number(b))
		});
		let str = '';
		for (let j = 0; j < keys.length; j++) {
			str += JSON.stringify(keys[j])
			str += JSON.stringify(obj[i][keys[j]])
		}
		if (!stringify.hasOwnProperty(str)) {
			uniques.push(obj[i]);
			stringify[str] = true
		}
	}
	uniques = uniques;
	return uniques;
}