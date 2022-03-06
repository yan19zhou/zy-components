/*
 * @Description:
 * @Author: zhouy
 * @Date: 2021-07-27 19:09:51
 * @LastEditTime: 2021-12-23 15:14:21
 * @LastEditors: zhouy
 */

const routes = [{
        path: "/",
        name: "home",
        redirect: "/home",
        meta: {
            title: "首页 ",
        },
        component: () =>
            import ("@/views/home/index"),
    },
    {
        path: "/btns",
        name: "btns",
        meta: { title: "按钮" },
        component: () =>
            import ("@/views/btns/index"),
    },
    {
        path: "/animation",
        name: "animation",
        meta: { title: "动画效果" },
        component: () =>
            import ("@/views/animation/index"),
    },
    {
        path: "/loading",
        name: "loading",
        meta: { title: "加载中效果" },
        component: () =>
            import ("@/views/Loading/index"),
    },
    {
        path: "/handleFn",
        name: "handleFn",
        meta: { title: "手写代码" },
        component: () =>
            import ("@/views/handleFn/index"),
        children: [{
            path: "/bind",
            name: "bind",
            meta: { title: "手写bind" },
            component: () =>
                import ("@/views/handleFn/bind/index"),
        }, ],
    },
];

export default routes;