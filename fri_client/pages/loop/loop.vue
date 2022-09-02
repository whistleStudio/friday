<template>
	<view class="loop" :style="{height: wH+'px'}">
		<view class="chat-box">
			<text>{{showText}}</text>
			<image v-if="isShowNext" src="../../static/loop/icons_next.png" mode="heightFix"></image>
		</view>
		<view class="bg" :class="{showBg: isShowBg}" :style="{backgroundImage: `url(${bgUrl[0]})`}">
			
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				wH: 0,
				showText: "",
				isShowBg: false,
				isShowNext: false,
				bgUrl: [
					"https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/badloop.jpg",
					"https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/goodloop.jpg"
				],
				story: {
					win: [],
					fail:["你感到一阵眩晕，昏睡了过去...", "醒来的时候，已经是天亮", "弗莱德：嘿，老伙计，你总算醒了", "弗莱德：就差一点了，我们一定会离开这的", "阳光洒在了他的身上... 会的..."],
				}
			}
		},
		methods: {
			
		},
		onLoad (p) {
			// console.log(typeof p.res, p.res)
			uni.getSystemInfo({
				success: info => {
					this.wH = info.windowHeight
				}
			})
			;(async () => {
				await typeWritter.call(this, this.story.fail[0])
				this.isShowBg = true
				await typeWritter.call(this, this.story.fail[1])
				await typeWritter.call(this, this.story.fail[2], {p:4})
				await typeWritter.call(this, this.story.fail[3], {p:4})
				await typeWritter.call(this, this.story.fail[4], {retain:1})
				this.isShowNext = true
			})()
		}
	}
	
	function typeWritter (txt, {p=0, retain=0}={}) {
		let tim = 0
		return new Promise((rsv, rej) => {
			this.showText=txt.slice(0, p)
			tim = setInterval(()=>{
				if (p<txt.length) {
					this.showText += txt[p]
					p++
				} else {
					clearInterval(tim)
					if (retain) rsv()
					else {
						setTimeout(()=>{this.showText="";rsv()},800)
					}
				}
			},140)
		})
	}
</script>

<style lang="scss">
.loop {
	width: 100%;
	background-color: $gray50;
	display: flex;
	justify-content: center;
	align-items: flex-end;
	.chat-box {
		margin-bottom: 50rpx;
		width: 90%;
		height: 150rpx;
		background-color: rgba(255,255,255,0.1);
		border-radius: 10rpx;
		box-sizing: border-box;
		padding: 20rpx;
		position: relative;
		z-index: 5;
		text {
			font-family: $fontF;
			line-height: 55rpx;
			color: white;
		}
		image {
			position: absolute;
			height: 40rpx;
			right: 20rpx;
			bottom: 10rpx;
			opacity: 0;
			animation: blink 1s infinite;
		}
	}
	.bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: $gray50 center/cover no-repeat;
		z-index: 2;
		opacity: 0;
	}
	.showBg {
		animation: fade 4s forwards;
	}
	@keyframes fade {
		from {opacity: 0;}
		to {opacity: 0.8;}
	}
	@keyframes blink {
		0% {opacity: 0;}
		50% {opacity: 0.9;}
		100% {opacity: 0;}
	}
}
</style>
