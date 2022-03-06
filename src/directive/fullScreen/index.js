/*
 * @Author: cqg
 * @Date: 2021-07-16 10:38:17
 * @LastEditTime: 2021-07-16 11:40:47
 * @Description: 强制全屏
 * @LastEditors: cqg
 */
export default {
  install(Vue) {
    Vue.directive("fullScreen", {
      inserted(el, binding) {
        var docElm = document.documentElement;
        //W3C
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        }
        //FireFox
        else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        }
        //Chrome等
        else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        }
        //IE11
        else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
      },
    });
  },
};
