<!--
 * @Description: Swiper轮播组件
 * @Author: Lxc
 * @Date: 2021-07-12 18:32:07
 * @LastEditors: Lxc
 * @LastEditTime: 2021-07-13 15:49:51
-->
<template>
  <div class="swiper-button-wrapper">
    <div
      class="swiper-container my-swiper-wrapper"
      :class="{ hasButton: option.button }"
      :id="id"
      :name="name"
    >
      <slot></slot>
      <!-- 如果需要导航按钮 -->
    </div>
    <div
      v-if="option.direction != 'vertical' && option.button"
      class="swiper-button-prev"
      :class="[id + '-prev',buttonType+'-prev']"
    ></div>
    <div
      v-if="option.direction != 'vertical' && option.button"
      class="swiper-button-next"
      :class="[id + '-next',buttonType+'-next']"
    ></div>
  </div>
</template>

<script>
import Swiper from "swiper/swiper-bundle.js";
let swiperInstance = {};
export default {
  data: () => {
    return {
      id: "",
      activeIndex: 0,
    };
  },
  props: {
    option: Object,
    value: Number,
    name: String,
    buttonType:String,
  },
  mounted() {
    let self = this;
    let option = {};
    if (this.option.autoplay) {
      option.autoplay = {
        delay: this.option.autoplayDelay,
        stopOnLastSlide: false,
        disableOnInteraction: this.option.disableOnInteraction,
        waitForTransition: true,
      };
    }
    if (this.option.direction != "vertical" && this.option.button) {
      option.navigation = {
        nextEl: `.${this.id}-next`,
        prevEl: `.${this.id}-prev`,
      };
    }
    console.log({
      touchStartPreventDefault: false, //没有这个echart图的legend无法点击
      loop: false, // 循环模式选项
      direction: this.option.direction || "horizontal",
      ...option,
      initialSlide: this.option.initialSlide || 0,
      slidesPerView: this.option.slidesPerView || 1,
      spaceBetween: this.option.spaceBetween || 0,
      slidesPerGroup: this.option.slidesPerGroup || 1, // 定义slides的数量多少为一组
      centeredSlides: false,
      on: {
        slideChange: function() {
          self.$emit("input", this.realIndex);
          self.activeIndex = this.realIndex;
        },
      },
    })
    let instance = new Swiper(`#${this.id}`, {
      touchStartPreventDefault: false, //没有这个echart图的legend无法点击
      loop: false, // 循环模式选项
      direction: this.option.direction || "horizontal",
      ...option,
      initialSlide: this.option.initialSlide || 0,
      slidesPerView: this.option.slidesPerView || 1,
      spaceBetween: this.option.spaceBetween || 0,
      slidesPerGroup: this.option.slidesPerGroup || 1, // 定义slides的数量多少为一组
      centeredSlides: false,
      on: {
        slideChange: function() {
          self.$emit("input", this.realIndex);
          self.activeIndex = this.realIndex;
        },
      },
    });
    swiperInstance[this.id] = instance;
    self.$emit("getInstance", instance);
    if (self.option.autoplay) {
      var mySwipers = document.getElementsByName(this.name);
      for (var i = 0; i < mySwipers.length; i++) {
        let mySwiper = mySwipers[i];
        mySwiper.onmouseenter = function() {
          instance.autoplay.stop();
        };
        mySwiper.onmouseleave = function() {
          instance.autoplay.start();
        };
      }
    }

    // setInterval(()=>{
    //   if (!instance.autoplay.running) {
    //     instance.autoplay.start()
    //   }
    // }, 1500)
  },
  created() {
    const getID = (length) => {
      return Number(
        Math.random()
          .toString()
          .substr(3, length) + Date.now()
      ).toString(36);
    };
    this.id = "s" + getID(5);
  },
  destoryed() {
    swiperInstance[this.id].destory();
    delete swiperInstance[this.id];
  },
  watch: {
    value: {
      handler(val, oldVal) {
        if (
          swiperInstance[this.id] &&
          val != swiperInstance[this.id].realIndex
        ) {
          swiperInstance[this.id].slideToLoop(val);
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss">
@import "../../node_modules/swiper/swiper-bundle.css";
.swiper-button-wrapper {
  position: relative;
  width: 100%;
  .my-swiper-wrapper {
    &.hasButton {
      width: calc(100% - 80px);
    }

    .swiper-slide {
      transition: 300ms;
    }
    .swiper-slide-active,
    .swiper-slide-duplicate-active {
      transform: scale(1);
    }
  }
  // .swiper-button-next:after,
  // .swiper-container-rtl .swiper-button-prev:after {
  //   color: #fff;
  // }
  // .swiper-button-prev:after,
  // .swiper-container-rtl .swiper-button-next:after {
  //   color: #fff;
  // }
  .swiper-button-prev.swiper-button-disabled,
  .swiper-button-next.swiper-button-disabled {
    cursor: not-allowed;
  }
  .swiper-button-prev.swiper-button-disabled,
  .swiper-button-next,
  .swiper-button-prev,
  .swiper-button-next.swiper-button-disabled {
    width: 32px;
    height: 58px;
    background: #D8D8D8;
    border-radius: 4px;
    color: #FFFFFF;
    outline: none;
  }
  .swiper-button-prev,
  .swiper-button-next {
    background: #BDBDBD;
    color: #ffffff;
    margin-top: -30px;
    &:after{
      font-size: 24px;
    }
    // background: url("../assets/images/swiper-icon/white-right.png") no-repeat;
    // background-size: contain;
  }
  .swiper-button-prev{
    left: 0;
  }
  .swiper-button-next{
    right: 0;
  }
  // .swiper-button-prev {
    // background: url("../assets/images/swiper-icon/white-left.png") no-repeat;
    // background-size: contain;
  // }
  .swiper-button-next.swiper-button-disabled {
    // background: url("./img/gray-right.png") no-repeat;
    background-size: contain;
  }

  .blue-arrow-prev.swiper-button-disabled,
  .blue-arrow-next,
  .blue-arrow-prev,
  .blue-arrow-next.swiper-button-disabled {
    width: 19px;
    height: 18px;
    background: url("../assets/images/swiper-icon/gray-left.png") no-repeat;
    background-size: contain;
    color: transparent;
    outline: none;
  }
  .blue-arrow-next {
    background: url("../assets/images/swiper-icon/blue-right.png") no-repeat;
    background-size: contain;
  }
  .blue-arrow-prev {
    background: url("../assets/images/swiper-icon/blue-left.png") no-repeat;
    background-size: contain;
  }
  .blue-arrow-next.swiper-button-disabled {
    background: url("../assets/images/swiper-icon/gray-right.png") no-repeat;
    background-size: contain;
  }
}
</style>
