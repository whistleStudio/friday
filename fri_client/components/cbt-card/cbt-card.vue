<template>
	<view class="">
		<view class="cbt-content flex-col-rowcenter" :class="{free:isFree==1, notFree:isFree==2}">
			<view class="cbt-top">
				<text>{{cardInfo.atk2||cardInfo.atk}}</text>
				<text>{{chs[cardInfo.ch]}}</text>
				<image :src="`../../static/play/cost${cardInfo.cost}.png`" mode="heightFix"></image>
			</view>
			<view class="cbt-mid" :style="{backgroundImage: `url(${imgUrl+cardInfo.ch}.png)`}">
				
			</view>
			<view class="cbt-bot" v-if="!cardInfo.skill2">
				{{skill[cardInfo.skill]}}
			</view>
			<view class="cbt-bot sk2" v-else>
				{{skill[cardInfo.skill2]}}
			</view>
		</view>
		<view class="mask" v-if="0">
			<view class="">
				<button size="mini">效果说明</button>
				<button size="mini">触发效果</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {chs, skill} from "@/style/card.json"
	export default {
		name:"cbt-card",
		data() {
			return {
				chs,skill,
				isMaskShow: false,
				isAct: false,
				imgUrl: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/scene/scene"
			};
		},
		props: {
			cardInfo: Object,
			isFree: {
				type: Number,
				default: 0
			}
		}
	}
</script>

<style lang="scss">
.cbt-content {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	border-radius: 10rpx;
	padding: 10rpx;
	.cbt-top {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		text:first-of-type {
			font: bold 45rpx $fontF;
		}
		text:last-of-type {
			font-size: 30rpx;
		}
		image {
			height: 50rpx;
		}
	}
	.cbt-mid {
		margin: 10rpx 0;
		background: center/cover no-repeat;
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
	}
	.cbt-bot {
		font-size: 40rpx;
	}
}
.mask {
	top:0;
	position: absolute;
}
.sk2 {
	color: rgb(52, 140, 154);
}
.free {
	border: 1rpx solid rgb(200,200,200);
}
.notFree {
	border: 1rpx solid rgb(55, 154, 113);
}
</style>