<template>
	<view class="adv-card">
		<view class="advImg" :style="{backgroundImage: `url(${imgUrl.advScene+curAdvCard.ch2}.png)`}">
			<image src="@/static/play/info.png" mode="widthFix"></image>
		</view>
		<view class="advInfo">
			<text>{{chs[curAdvCard.ch2]}}</text>
			<view class="advbox">
				<ul class="adv-phase">
					<li v-for="(v,i) in Array(3)" :key="i" :style="{backgroundColor:imgUrl.phColor[i]}">{{curAdvCard.harm[i]}}</li>
				</ul>
				<view class="drawNum"><text>{{curAdvCard.draw-drawCount}}</text></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {chs} from "@/style/card.json"
	
	export default {
		name:"adv-card",
		data() {
			return {
				chs,
				imgUrl: {
					phColor:['rgb(98, 204, 141)','rgb(237, 223, 93)','rgb(247, 92, 110)'],
					advScene: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/test/scene"
				},
			};
		},
		computed: {
			curAdvCard () {return this.$gts.curAdvCard},
		},
		props: {
			drawCount: Number,
		}
	}
</script>

<style lang="scss">
.adv-card {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	padding: 0 20rpx;
	box-sizing: border-box;
	.advImg {
		width: 250rpx;
		height: 250rpx;
		background: center/cover no-repeat;
		border-radius: 10rpx;
		position: relative;
		image {
			position: absolute;
			width: 50rpx;
			bottom: 10rpx;
			left: 10rpx;
		}
	}
	.advInfo {
		margin-left: 40rpx;
		// background-color: green;
		height: 250rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		>text {
			font: 40rpx/60rpx $fontF;
		}
		.advbox {
			display: flex;
			align-items: flex-end;
			margin-top: 30rpx;
			ul {
				display: flex;
				li {
					width: 70rpx;
					height: 70rpx;
					background-color: cadetblue;
					font: 45rpx/70rpx $fontF;
					color: white;
					text-align: center;
				}
			}
			.drawNum {
				margin-left: 50rpx;
				width: 74rpx;
				height: 100rpx;
				// background-color: white;
				background: url("@/static/play/drawcard.png") center/contain no-repeat;
				position: relative;
				text {
					font: 60rpx $fontF;
					position: relative;
					left: 11rpx;
					top: 14rpx;	
				}
			}
		}
	}
}
</style>