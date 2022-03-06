import { ToCDB } from "@/utils";

export default {
	install(Vue) {
		Vue.directive("onlyNumber", {
			inserted(el, vDir, vNode) {
				// vDir.value 有指令的参数
				let content;
				// 数字和点的全角字符Unicode 编码
				const numberKeyCodeArr = [
					65294,
					65296,
					65297,
					65298,
					65299,
					65300,
					65301,
					65302,
					65303,
					65304,
					65305
				];
				//定义方法,阻止输入
				function preventInput(e) {
					e.preventDefault ? e.preventDefault() : (e.returnValue = false);
				}
				// 数字字符校验（不包含全角字符）
				let re = /\d|\./;
				//按键按下=>只允许输入 数字/小数点
				el.addEventListener("keypress", event => {
					let e = event || window.event;
					let inputKey = String.fromCharCode(
						typeof event.charCode === "number" ? event.charCode : event.keyCode
					);
					content = e.target.value;
					if (
						(!re.test(inputKey) &&
							!e.ctrlKey &&
							!numberKeyCodeArr.includes(e.charCode)) ||
						(content.indexOf(".") > 0 && inputKey == ".") ||
						(content.indexOf(".") > 0 && content.split(".").pop().length >= 2)
					) {
						preventInput(e);
					}
				});
				//按键弹起=>并限制最大最小
				el.addEventListener("keyup", event => {
					let e = event || window.event;
					let halfCodeReg = /[\uff00-\uffff]/g;
					if (halfCodeReg.test(e.target.value)) {
						// 针对windows全角输入识别无效的问题做兼容处理
						content = ToCDB(e.target.value);
						if (
							content.indexOf(".") > 0 &&
							content.split(".").pop().length > 2
						) {
							content = content.replace(/\d{1}$/, "");
						}
						vNode.data.model.callback(content);
					} else {
						content = parseFloat(e.target.value);
					}
					if (!content) {
						content = 0.0;
					}
					let arg_max = "";
					let arg_min = "";
					if (vDir.value) {
						arg_max = parseFloat(vDir.value.max);
						arg_min = parseFloat(vDir.value.min);
					}
					if (arg_max && content > arg_max) {
						e.target.value = arg_max;
						content = arg_max;
					}
					if (arg_min && content < arg_min) {
						e.target.value = arg_min;
						content = arg_min;
					}
				});
				//失去焦点=>保留指定位小数
				el.addEventListener("focusout", event => {
					//此处会在 el-input 的 @change 后执行
					let e = event || window.event;
					let halfCodeReg = /[\uff00-\uffff]/g;
					if (halfCodeReg.test(e.target.value)) {
						content = parseFloat(ToCDB(e.target.value));
						vNode.data.model.callback(content);
					} else {
						content = parseFloat(e.target.value);
					}
					if (!content && content != 0) {
						content = "";
					}
					let arg_precision = 0; //默认保留至整数
					if (vDir.value.precision) {
						arg_precision = parseFloat(vDir.value.precision);
					}
					if (content && content.toString().indexOf(".") > 0) {
						e.target.value = content.toFixed(arg_precision);
					} else {
						e.target.value = content;
					}
				});
			}
		});
	}
};
