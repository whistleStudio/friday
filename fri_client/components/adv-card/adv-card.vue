<template>
	<view v-if="!isBoss" class="adv-card">
		<view v-if="curAdvCard" class="advImg" :style="{backgroundImage: `url(${imgUrl.advScene+curAdvCard.ch2}.png)`}">
			<image src="@/static/play/info.png" mode="widthFix"></image>
		</view>
		<view class="advInfo">
			<text>{{chs[curAdvCard.ch2]}}</text>
			<view class="advbox">
				<ul class="adv-phase">
					<li v-for="(v,i) in Array(3)" :key="i" :class="{act: (curPhase-temp.ph)==i}"
					:style="{backgroundColor:imgUrl.phColor[i]}">{{harm[curAdvCard.ch2][i]}}</li>
				</ul>
				<view class="drawNum"><text>{{curDraw-drawCount}}</text></view>
			</view>
		</view>
	</view>
	<view v-else class="adv-card-boss" :style="{backgroundImage: `url(${imgUrl.pirate+curAdvCard.id}.png)`}">
		<view class="drawNum"><text>{{curDraw-drawCount}}</text></view>
		<view v-if="isChangeAtk" class="prtAtk">{{prtHarm}}</view>
		<ul class="prtIcon flex-col-rowcenter">
			<li v-for="(v, i) in prtL" :key="i" class=""></li>
		</ul>
	</view>
</template>

<script>
	import {mapState} from "vuex"
	import {chs,harm} from "@/style/card.json"
	
	export default {
		name:"adv-card",
		data() {
			return {
				chs, harm,
				imgUrl: {
					phColor:['rgb(98, 204, 141)','rgb(237, 223, 93)','rgb(247, 92, 110)'],
					advScene: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/scene/scene",
					pirate: "	https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/prt/prt"
				},
			};
		},
		computed: {
			...mapState({
				prtHarm: state => state._gameInfo.prtHarm,
				prtL: state => state._cards.prtDeck.length,
			}),
			isChangeAtk () {
				let sk = this.curAdvCard.skill
				return (sk===50)||(sk===54) ? true : false
			}
		},
		props: {
			drawCount: Number,
			temp: Object,
			curAdvCard: Object,
			isBoss: Boolean,
			curPhase: Number,
			curDraw: Number,
		},
		created () {
			// if (this.isBoss) {
				
			// }
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
					// background-color: cadetblue;
					font: 45rpx/70rpx $fontF;
					color: white;
					text-align: center;
					box-sizing: border-box
				}
				.act {
					font-weight: bold;
					line-height: 58rpx;
					border: 6rpx solid rgb(33, 150, 243);
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
		height: 50rpx;
		position: absolute;
		background-color: #FFF6DB;
		left: 83rpx;
		top: 28rpx;
		border-radius: 15rpx;
		text-align: center;
		text {
			font: bold 42rpx/50rpx $fontF;
			color: $gray100;
		}
	}
	.prtAtk {
		width: 40rpx;
		height: 40rpx;
		background-color: #e95c05;
		position: absolute;
		right: 107rpx;
		top: 70rpx;
		font: bold 35rpx/40rpx $fontF;
		text-align: center;
		color: white;
	}
	.prtIcon {
		position: absolute;
		right: 8rpx;
		transform: translateY(-50%);
		top: 50%;
		width: 50rpx;
		height: 100rpx;
		justify-content: space-between;
		li {
			width: 45rpx;
			height: 35rpx;
			background: url("@/static/play/prt.png") center/cover no-repeat;
		}
	}
}
</style>