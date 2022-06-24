<template>
	<view v-if="!isBoss" class="adv-card">
		<view v-if="curAdvCard" class="advImg" :style="{backgroundImage: `url(${imgUrl.advScene+curAdvCard.ch2}.png)`}">
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
	<view v-else class="adv-card-boss" :style="{backgroundImage: `url(${imgUrl.pirate+curAdvCard.ch}.png)`}">
		<view class="drawNum"><text>{{curAdvCard.draw-drawCount}}</text></view>
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
					advScene: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/test/scene",
					pirate: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/test/pirate"
				},
			};
		},
		computed: {
			curAdvCard () {return this.$gts.curAdvCard},
			isBoss () {return this.$sta._gameInfo.isBoss},
			// curPrt () {return this.$gts.curPrt}
		},
		props: {
			drawCount: Number,
		},
		mounted () {
			console.log(this.curAdvCard)
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
				background: url("@/static/play/drawcard.png") center/contain no-repeat;
				position: relative;
				text {
					font: 60rpx $fontF;
					position: absolute;
					left: 11rpx;
					top: 14rpx;	
				}
			}
		}
	}
}
.adv-card-boss {
	width: 100%;
	height: 100%;
	border-radius: 10rpx;
	background: #FFF6DB center/contain no-repeat;
	position: relative;
	.drawNum {
		width: 50rpx;
		height: 60rpx;
		position: absolute;
		background-color: #FFF6DB;
		left: 83rpx;
		top: 26rpx;
		border-radius: 15rpx;
		text-align: center;
		text {
			font: bold 45rpx/60rpx $fontF;
			color: $gray100;
		}
	}
}
</style>