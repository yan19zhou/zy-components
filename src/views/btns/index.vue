<!--
 * @Description: 按钮效果
 * @Author: zhouy
 * @Date: 2021-07-28 10:04:39
 * @LastEditTime: 2021-12-22 14:41:29
 * @LastEditors: zhouy
-->
<template>
  <div>
    <div class="card">
      <div class="cardItem">
        <div class="tips">流光效果4</div>
        <div class="blueBtn zyHeightFour" style="--count:infinite;--heightColor:#fff;--speed:4s;--borderRadius:0;">
          <img class="zyStar" src="static/icon_star.png" />
          流光效果4
        </div>
        <div class="className">zyHeightFour zyStar</div>
      </div>

      <div class="cardItem">
        <div class="tips">文本点击1</div>
        <div hover-class="zyTextClick1">我是文字</div>
        <div class="className">zyTextClick1</div>
      </div>

      <div class="cardItem">
        <div class="tips">提示点击效果</div>
        <div class="btn zyJittery1" style="--count:infinite;">按钮</div>
        <div class="className">zyJittery1</div>
      </div>

      <div class="cardItem">
        <div class="tips">点击效果</div>
        <div class="btn" hover-class="zyBtnClick1" style="border-bottom: 10px solid rgb(138 30 32);">
          按钮
        </div>
        <div class="className">zyBtnClick1</div>
      </div>

      <div class="cardItem">
        <div class="tips">按钮动画</div>
        <div class="btn" style="position: relative;width: 160px;">
          <div class="zyDot" style="--left:0%;--right:400%;--bg:#000000;"></div>
          粒子
        </div>
        <div class="className">zyDot</div>
      </div>

      <div class="cardItem">
        <div class="tips">红包展示</div>
        <!-- count:Number || infinite || both; -->
        <div
          class="zyMidSkewShow"
          style="
        			--count:infinite;--speed:1s;
        			width: 50px;height: 80px;background-color: red;border-radius: 5px;"
        ></div>
        <div class="className">zyMidSkewShow</div>
      </div>

      <div class="cardItem" style="background-color:#f45e6142;">
        <div class="tips">效果3</div>
        <!-- count:Number || infinite; -->
        <div class="grayBtn zyHeightThree" style="--count:infinite;--heightColor:#fff;--speed:4s;--borderRadius:0;">
          流光效果3
        </div>
        <div class="className">zyHeightThree</div>
      </div>
      <div class="cardItem">
        <div class="tips">小手点击</div>
        <!-- transform-origin: top;top:上基准摇晃 bottom:下基准摇晃 -->
        <div style="position: relative;width: 60px;height: 60px;">
          <img class="zyHand" style="width: 60px;height: 60px;" src="./image/shou.png" />
        </div>
        <div class="className">zyHand</div>
      </div>
      <div class="cardItem">
        <div class="tips">摇晃放大</div>
        <!-- transform-origin: top;top:上基准摇晃 bottom:下基准摇晃 -->
        <img class="zyRotateAndScale" style="transform-origin: left bottom;width: 100px;height: 80px;" src="./image/shouji.png" />
        <div class="className">zyRotateAndScale</div>
      </div>
      <div class="cardItem">
        <div class="tips">消失</div>
        <!-- count:Number || infinite; -->
        <div class="btn zyHide">
          消失
        </div>
        <div class="className">zyHide</div>
      </div>
      <div class="cardItem" style="background-color:#f45e6142;">
        <div class="tips">购物车</div>
        <div style="position: relative;width: 60px;height: 60px;border-radius: 50%;background-color:rgba(0, 0, 0, 0.6);display: flex;align-items: center;justify-content: center;">
          <div class="zyDrop"></div>
          <img class="zyCart" src="./image/icon_cart.png" />
        </div>
        <div class="className">zyDrop zyCart</div>
      </div>
      <div class="cardItem">
        <div class="tips">流光效果2</div>
        <div class="btn zyHeightSec">流光2</div>
        <div class="className">zyHeightSec</div>
      </div>
      <div class="cardItem" style="background-color:#f45e6142;">
        <div class="tips">旋转</div>
        <div class="zyMusic" style="--contentBefore:'♫';--contentAfter:'♩';--zIndex:999;--color:#ffffff">
          <div class="bubble zyRotate" style="animation-duration: 10s;">
            气泡
          </div>
        </div>
        <div class="className">zyRotate zyMusic</div>
      </div>
      <div class="cardItem">
        <div class="tips">直播头像</div>
        <div class="zyPortrait" style="--color:#ff0081;">
          <div class="bubble zyBeat">气泡</div>
        </div>
        <div class="className">zyPortrait zyBeat</div>
      </div>
      <div class="cardItem">
        <div class="tips">直播</div>
        <div style="width: 50px;height: 50px;display: flex;align-items: center;justify-content: center;">
          <div class="zyLive" style="--color:red;"></div>
        </div>
        <div class="className">zyLive</div>
      </div>
      <div class="cardItem">
        <div class="tips">流光效果</div>
        <div class="btn zyHeight">流光</div>
        <div class="className">zyHeight</div>
      </div>
      <div class="cardItem">
        <div class="tips">箭头</div>
        <div class="chevronBox" style="transform: rotate(0deg);">
          <div style="animation-delay:0s" class="zyChevron"></div>
          <div style="animation-delay:1s" class="zyChevron"></div>
          <div style="animation-delay:2s" class="zyChevron"></div>
          <!-- <div v-for="(item,index) in 3" :style="{'animation-delay':`${index}s`}" class="zyChevron" :key="index" ></div> -->
        </div>
        <div class="className">zyChevron</div>
      </div>
      <div class="cardItem">
        <div class="tips">添加黑色波纹</div>
        <!-- color:rgba(0, 0, 0, 0.15); 黑色    color:rgba(255, 255, 255, 0.6); 白色 -->
        <div class="bubble zyHot" style="--color:rgba(0, 0, 0, 0.15);"></div>
        <div class="className">zyHot</div>
      </div>
      <div class="cardItem">
        <div class="tips">添加其他颜色波纹</div>
        <div class="bubble zyHot" style="--color:rgba(255, 0, 4, 0.6);"></div>
        <div class="className">zyHot</div>
      </div>
      <div class="cardItem">
        <div class="tips">缩小点击效果</div>
        <!-- count:Number || infinite -->
        <div class="btn zyHover1" style="--count:infinite;">按钮</div>
        <div class="className">zyHover1</div>
      </div>
      <div class="cardItem">
        <div class="tips">摇晃效果</div>
        <!-- transform-origin: top;top:上基准摇晃 bottom:下基准摇晃 -->
        <img class="zyShake" style="transform-origin: center bottom;width: 40px;height: 40px;" src="./image/shouji.png" />
        <div class="className">zyShake</div>
      </div>
      <div class="cardItem">
        <div class="tips">气泡点击效果</div>
        <!-- count:Number || infinite; -->
        <div class="btn zyHover2" style="--color:#ff0081;--count:infinite;">
          按钮
        </div>
        <div class="className">zyHover2</div>
      </div>
      <div class="cardItem">
        <div class="tips">抖动点击效果</div>
        <!-- count:Number || infinite; -->
        <div class="bubble zyHover3" style="--count:infinite;">气泡</div>
        <div class="className">zyHover3</div>
      </div>
      <div class="cardItem">
        <div class="tips">浮动效果</div>
        <div class="bubble zyFly">气泡</div>
        <div class="className">zyFly</div>
      </div>
      <div class="cardItem">
        <div class="tips">边框渐变</div>
        <button class="draw meet">draw meet</button>
      </div>
      <div class="cardItem">
        <div class="tips">边框滑动(单向</div>
        <button class="draw">draw</button>
      </div>
      <div class="cardItem">
        <div class="tips">边框滑动(双向</div>
        <button class="center">center</button>
      </div>
      <div class="cardItem">
        <div class="tips">边框滑竿</div>
        <button class="spin">spin</button>
      </div>
      <div class="cardItem">
        <div class="tips">圆形边框</div>
        <button class="spin circle">spin circle</button>
      </div>
      <div class="cardItem">
        <div class="tips">菱形边框</div>
        <button class="spin thick">spin thick</button>
      </div>
      <div class="cardItem">
        <div class="tips">边框滑动(四方)</div>
        <button class="dynamic-border">dynamic-border</button>
      </div>
    </div>
    <div class="effects">
      <h2>2D Transitions</h2>
      <a href="#" class="hvr_grow">Grow</a>
      <a href="#" class="hvr_shrink">Shrink</a>
      <a href="#" class="hvr_pulse">Pulse</a>
      <a href="#" class="hvr_pulse_grow">Pulse Grow</a>
      <a href="#" class="hvr_pulse_shrink">Pulse Shrink</a>
      <a href="#" class="hvr_push">Push</a>
      <a href="#" class="hvr_pop">Pop</a>
      <a href="#" class="hvr_bounce_in">Bounce In</a>
      <a href="#" class="hvr_bounce_out">Bounce Out</a>
      <a href="#" class="hvr_rotate">Rotate</a>
      <a href="#" class="hvr_grow_rotate">Grow Rotate</a>
      <a href="#" class="hvr_float">Float</a>
      <a href="#" class="hvr_sink">Sink</a>
      <a href="#" class="hvr_bob">Bob</a>
      <a href="#" class="hvr_hang">Hang</a>
      <a href="#" class="hvr_skew">Skew</a>
      <a href="#" class="hvr_skew_forward">Skew Forward</a>
      <a href="#" class="hvr_skew_backward">Skew Backward</a>
      <a href="#" class="hvr_wobble_horizontal">Wobble Horizontal</a>
      <a href="#" class="hvr_wobble_vertical">Wobble Vertical</a>
      <a href="#" class="hvr_wobble_to_bottom_right">Wobble To Bottom Right</a>
      <a href="#" class="hvr_wobble_to_top_right">Wobble To Top Right</a>
      <a href="#" class="hvr_wobble_top">Wobble Top</a>
      <a href="#" class="hvr_wobble_bottom">Wobble Bottom</a>
      <a href="#" class="hvr_wobble_skew">Wobble Skew</a>
      <a href="#" class="hvr_buzz">Buzz</a>
      <a href="#" class="hvr_buzz_out">Buzz Out</a>
      <h2>background Transitions</h2>
      <a href="#" class="hvr_fade">Fade</a>
      <a href="#" class="hvr_back_pulse">Back Pulse</a>
      <a href="#" class="hvr_sweep_to_right">Sweep To Right</a>
      <a href="#" class="hvr_sweep_to_left">Sweep To Left</a>
      <a href="#" class="hvr_sweep_to_bottom">Sweep To Bottom</a>
      <a href="#" class="hvr_sweep_to_top">Sweep To Top</a>
      <a href="#" class="hvr_radial_out">Radial Out</a>
      <a href="#" class="hvr_radial_in">Radial In</a>
      <a href="#" class="hvr_rectangle_in">Rectangle In</a>
      <a href="#" class="hvr_rectangle_out">Rectangle Out</a>
      <a href="#" class="hvr_shutter_in_horizontal">Shutter In Horizontal</a>
      <a href="#" class="hvr_shutter_out_horizontal">Shutter Out Horizontal</a>
      <a href="#" class="hvr_shutter_in_vertical">Shutter In Vertical</a>
      <a href="#" class="hvr_shutter_out_vertical">Shutter Out Vertical</a>
      <h2>Wayra</h2>
      <a href="#" class="hvr_border_thick">Open Project</a>
      <!--             <a href="#" class="hvr_border_pipaluk"><span>Open</span></a>
 -->
      <h2>Border Transitions</h2>
      <a href="#" class="hvr_border_fade">Border Fade</a>
      <a href="#" class="hvr_border_hollow">Hollow</a>
      <a href="#" class="hvr_border_trim">Trim</a>
      <a href="#" class="hvr_border_ripple_out">Ripple Out</a>
      <a href="#" class="hvr_border_ripple_in">Ripple In</a>
      <a href="#" class="hvr_border_outline_out">Outline Out</a>
      <a href="#" class="hvr_border_outline_in">Outline In</a>
      <a href="#" class="hvr_border_round_corners">Round Corners</a>
      <a href="#" class="hvr_border_underline_from_left">Underline From Left</a>
      <a href="#" class="hvr_border_underline_from_center">Underline From Center</a>
      <a href="#" class="hvr_border_underline_from_right">Underline From Right</a>
      <a href="#" class="hvr_border_reveal">Reveal</a>
      <a href="#" class="hvr_border_underline_reveal">Underline Reveal</a>
      <a href="#" class="hvr_border_overline_reveal">Overline Reveal</a>
      <a href="#" class="hvr_border_overline_from_left">Overline From Left</a>
      <a href="#" class="hvr_border_overline_from_center">Overline From Center</a>
      <a href="#" class="hvr_border_overline_from_right">Overline From Right</a>
      <h2>Icons</h2>
      <a href="#" class="hvr_icon_back">Back</a>
      <a href="#" class="hvr_icon_forward">Icon Forward</a>
      <a href="#" class="hvr_icon_down">Icon Down</a>
      <a href="#" class="hvr_icon_up">Icon Up</a>
      <a href="#" class="hvr_icon_spin">Icon Spin</a>
      <a href="#" class="hvr_icon_drop">Icon Drop</a>
      <a href="#" class="hvr_icon_fade">Icon Fade</a>
      <a href="#" class="hvr_icon_float_away">Icon Float Away</a>
      <a href="#" class="hvr_icon_sink_away">Icon Sink Away</a>
      <a href="#" class="hvr_icon_grow">Icon Grow</a>
      <a href="#" class="hvr_icon_shrink">Icon Shrink</a>
      <a href="#" class="hvr_icon_pulse">Icon Pulse</a>
      <a href="#" class="hvr_icon_pulse_grow">Icon Pulse Grow</a>
      <a href="#" class="hvr_icon_pulse_shrink">Icon Pulse Shrink</a>
      <a href="#" class="hvr_icon_push">Icon Push</a>
      <a href="#" class="hvr_icon_pop">Icon Pop</a>
      <a href="#" class="hvr_icon_bounce">Icon Bounce</a>
      <a href="#" class="hvr_icon_rotate">Icon Rotate</a>
      <a href="#" class="hvr_icon_grow_rotate">Icon Grow Rotate</a>
      <a href="#" class="hvr_icon_float">Icon Float</a>
      <a href="#" class="hvr_icon_sink">Icon Sink</a>
      <a href="#" class="hvr_icon_bob">Icon Bob</a>
      <a href="#" class="hvr_icon_hang">Icon Hang</a>
      <a href="#" class="hvr_icon_wobble_horizontal">Icon Wobble Horizontal</a>
      <a href="#" class="hvr_icon_wobble_vertical">Icon Wobble Vertical</a>
      <a href="#" class="hvr_icon_buzz">Icon Buzz</a>
      <a href="#" class="hvr_icon_buzz_out">Icon Buzz Out</a>
      <h2>Shadow and Glow Transitions</h2>
      <a href="#" class="hvr_shadow">Shadow</a>
      <a href="#" class="hvr_grow_shadow">Grow Shadow</a>
      <a href="#" class="hvr_float_shadow">Float Shadow</a>
      <a href="#" class="hvr_glow">Glow</a>
      <a href="#" class="hvr_shadow_radial">Shadow Radial</a>
      <a href="#" class="hvr_box_shadow_qutset">Box Shadow Outset</a>
      <a href="#" class="hvr_box_shadow_inset">Box Shadow Inset</a>
      <h2>Speech Bubbles</h2>
      <a href="#" class="hvr_bubble_top">Bubble Top</a>
      <a href="#" class="hvr_bubble_right">Bubble Right</a>
      <a href="#" class="hvr_bubble_bottom">Bubble Bottom</a>
      <a href="#" class="hvr_bubble_left">Bubble Left</a>
      <a href="#" class="hvr_bubble_float_top">Bubble Float Top</a>
      <a href="#" class="hvr_bubble_float_right">Bubble Float Right</a>
      <a href="#" class="hvr_bubble_float_bottom">Bubble Float Bottom</a>
      <a href="#" class="hvr_bubble_float_left">Bubble Float Left</a>
      <h2>Curls</h2>
      <a href="#" class="hvr_curl_top_left">Curl Top Left</a>
      <a href="#" class="hvr_curl_top_right">Curl Top Right</a>
      <a href="#" class="hvr_curl_bottom_right">Curl Bottom Right</a>
      <a href="#" class="hvr_curl_bottom_left">Curl Bottom Left</a>
    </div>

  </div>
</template>

<script>
import "./style.css";
import "./style1.css";
import "./styles-2.css";
import "./hover.styl";
import "./reset.styl";
export default {};
</script>

<style lang="scss" scoped></style>
