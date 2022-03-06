import { ToCDB } from "@/utils";

export default {
	install(Vue) {
		Vue.directive("halfCharCode", {
			inserted(el, vDir) {
				let content = "";
				//按键按下=>只允许输入 数字/小数点
				el.addEventListener("keyup", event => {
					let e = event || window.event;
					let re = /[\uff00-\uffff]/g;
					content = re.test(e.target.value)
						? ToCDB(e.target.value)
						: e.target.value;
				});

				//按键弹起=>并限制最大最小
				el.addEventListener("keyup", event => {
					let e = event || window.event;
					e.target.value = content;
				});
			}
		});
	}
};
