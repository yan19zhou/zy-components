/*
 * @Description:
 * @Author: zhouy
 * @Date: 2021-07-27 19:07:25
 * @LastEditTime: 2021-12-13 21:09:25
 * @LastEditors: zhouy
 */
import Vue from "vue";
import VueRouter from "vue-router";

import routes from "./routes";

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};

const router = new VueRouter({
    mode: "hash",
    base: process.env.BASE_URL,
    routes,
    // 页面滚动到指定位置
    scrollBehavior(to, from, savedPosition) {
        // prettier-ignore
        return to.hash ? { selector: to.hash } : { x: 0, y: 0 };
    },
});
router.beforeEach((to, from, next) => {
    console.log(to, from);
    next();
});
export default router;