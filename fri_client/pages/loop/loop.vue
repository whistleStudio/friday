<template>
	<view class="loop" :style="{height: wH+'px'}">
		<view class="chat-box" @click="toIndex">
			<text>{{showText}}</text>
			<image v-if="isShowNext" src="../../static/loop/icons_next.png" mode="heightFix"></image>
		</view>
		<view class="bg" :class="{showBg: isShowBg==1, hideBg: isShowBg==-1}" :style="{backgroundImage: `url(${bgUrl[gameRes]})`}">
			
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				gameRes: 0,
				wH: 0,
				showText: "",
				isShowBg: 0,
				isShowNext: false,
				bgUrl: [
					"https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/badloop.jpg",
					"https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/goodloop.jpg"
				],
				story: {
					win: ["你击败海盗，缴获了他们的船只和货物。天色渐晚，你和弗莱德决定明日离岛",  "想着凭这整船货物以后也能过上不错的生活，你很快便进入了梦乡", "...巨大的海浪声惊醒了你", "！！！海盗船已经远离，弗莱德也没了踪影","荒岛的日子还在继续...", "有时你甚至一时想不起自己的姓名，但那个男人的名字你却永远地记了下来..."],
					fail:["你感到一阵眩晕，昏睡了过去...", "醒来的时候，已经是天亮", "弗莱德： 嘿，老伙计，你总算醒了", "弗莱德： 就差一点了，我们一定会离开这的", "阳光洒在了弗莱德的身上...我想会的..."],
				}
			}
		},
		methods: {
			toIndex () {
				if (this.isShowNext) {
					uni.navigateTo({
						url: "/pages/index/index"
					})
				}
			}
		},
		onLoad (p) {
			// console.log(typeof p.res, p.res)
			uni.getSystemInfo({
				success: info => {
					this.wH = info.windowHeight
				}
			})
			this.gameRes = p.res
			;(async () => {
				if (this.gameRes) {
					await typeWritter.call(this, this.story.win[0])
					await typeWritter.call(this, this.story.win[1])
					this.isShowBg = 1
					await typeWritter.call(this, this.story.win[2])
					this.isShowBg = -1
					await typeWritter.call(this, this.story.win[3])
					await typeWritter.call(this, this.story.win[4])
					await typeWritter.call(this, this.story.win[5], {retain: 1})
				} else {
					await typeWritter.call(this, this.story.fail[0])
					this.isShowBg = 1
					await typeWritter.call(this, this.story.fail[1])
					await typeWritter.call(this, this.story.fail[2], {p:4})
					await typeWritter.call(this, this.story.fail[3], {p:4})
					await typeWritter.call(this, this.story.fail[4], {retain:1})
				}
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
		background-color: rgba(255,255,255,0.05);
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
		animation: fadeIn 4s forwards;
	}
	.hideBg {
		animation: fadeOut 3s forwards;
	}
	@keyframes fadeIn {
		from {opacity: 0;}
		to {opacity: 0.8;}
	}
	@keyframes fadeOut {
		from {opacity: 0.8;}
		to {opacity: 0;}
	}
	@keyframes blink {
		0% {opacity: 0;}
		50% {opacity: 0.9;}
		100% {opacity: 0;}
	}
}
</style>
