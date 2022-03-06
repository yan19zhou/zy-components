//弹窗视频播放
<template>
	<div :class="['cVideoWrap',visible?'show':'']">
		<div class="c-box">
			<iframe id="cVideo" :src="src" frameborder="0" allowfullscreen></iframe>
		</div>
		<a class="video-close" @click="closeVideo">
			<span>×</span>
		</a>
	</div>
</template>

<script>
export default {
	name: 'popVideo',
	props: {
		//视频弹窗控制器
		visible: {
			type: Boolean,
			default: false,
		},
		//视频地址
		src: {
			type: String,
			default: '',
		},
	},
	methods: {
		closeVideo() {
			this.$emit('update:visible', false);
			setTimeout(() => {
        this.$emit('update:src', '');
      },500) 
		},
	},
};
</script>

<style lang="scss" >
.cVideoWrap {
	position: fixed;
	left: 0;
	top: 100%;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 100000;
	transition: top 0.5s ease-in-out;
	&.show {
		top: 0;
	}
	.c-box {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		iframe {
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
			right: 0px;
			bottom: 0px;
			max-width: 100%;
			max-height: 100%;
			margin: auto;
		}
	}
	.video-close {
		display: block;
		width: 40px;
		height: 40px;
		background-color: #409EFF;
		position: absolute;
		right: 0;
		top: 0;
		cursor: pointer;
		span {
			display: block;
			width: 100%;
			height: 100%;
			font-size: 21px;
			text-align: center;
			line-height: 40px;
			color: #fff;
		}
	}
	#cVideo{
		background-color:rgba(0,0,0,.9);
	}
}
</style>