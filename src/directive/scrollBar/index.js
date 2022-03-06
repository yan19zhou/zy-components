//插件的包
import PerfectScrollbar from "perfect-scrollbar";

//插件对应的css
import "perfect-scrollbar/css/perfect-scrollbar.css";

const el_scrollBar = el => {
	//在元素上加点私货，名字随便取，确保不会和已有属性重复即可，先叫_ps_
	if (el._ps_ instanceof PerfectScrollbar) {
		el._ps_.update();
	} else {
		//el上挂一份属性
		el._ps_ = new PerfectScrollbar(el, {
			suppressScrollX: true,
			scrollYMarginOffset: 0,
			useBothWheelAxes: true,
			swipeEasing: false
			//maxScrollbarLength: 4
		});
	}
};

export default {
	install(Vue) {
		function freeze() {
			document.documentElement.style.overflowY = "hidden";
		}

		function unfreeze() {
			document.documentElement.style.overflowY = "auto";
		}

		Vue.directive("scrollBar", {
			bind(el, binding) {
				if (!el) return;
				if (binding.modifiers.scrollLimit) {
					el.addEventListener("mouseenter", freeze, { passive: true });
					el.addEventListener("mouseleave", unfreeze);
				}
			},

			unbind(el, binding) {
				if (binding.modifiers.scrollLimit) {
					el.removeEventListener("mouseenter", freeze, { passive: true });
					el.removeEventListener("mouseleave", unfreeze);
					unfreeze();
				}
			},

			//使用inserted钩子函数（初次创建dom）获取使用自定义指令处的dom
			inserted(el) {
				const rules = ["fixed", "absolute", "relative"];
				// 无定位则加上相对定位
				if (!rules.includes(window.getComputedStyle(el, null).position)) {
					el.style.position = "relative";
				}

				//el上挂一份属性
				el_scrollBar(el);
			},

			//更新dom的时候
			componentUpdated(el, binding, vnode, oldVnode) {
				try {
					vnode.context.$nextTick(() => el_scrollBar(el));
				} catch (error) {
					el_scrollBar(el);
				}
			}
		});
	}
};
