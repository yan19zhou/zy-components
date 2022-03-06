/***
 *  节流 每单位时间可触发一次
 *  第一次瞬间触发，最后一次不管是否达到间隔时间依然触发
 * 	并不只有按钮能用，其他元素或者组件也可以使用此组件
 *  @param {?Number|800} time - 间隔时间
 *  @param {Function} fn - 执行事件
 *  @param {?String|"click"} event - 事件类型 例："click"
 *  @param {Array} binding.value - [fn,event,time]
 *  例：
 * 	无需传递参数时: <el-button v-throttle="[reset]">刷新</el-button>
 *  传递参数则：<el-button v-throttle="[()=>reset(param)]">刷新</el-button>
 *  非点击事件或需要增加间隔时间：<el-button v-throttle="[()=>reset(param),'blur',1000]">刷新</el-button>
 */
export default {
	install(Vue) {
		Vue.directive("throttle", {
			inserted(el, binding) {
				let [fn, event = "click", time = 500] = binding.value;
				let timer = null;
				el.addEventListener(event, () => {
					// 触发前先清除上个定时器
					clearTimeout(timer);
					/* 500毫秒（默认）后执行传入的函数，同时把整个定时器赋值给timer，
             好让下次执行前清除上一个定时器，防止定时器出现堆叠 */
					timer = setTimeout(() => {
						fn();
					}, time);
				});
			}
		});
	}
};
