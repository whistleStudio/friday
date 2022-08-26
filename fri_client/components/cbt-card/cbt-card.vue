<template>
	<view class="cbt-card">
		<view class="cbt-content flex-col-rowcenter" :class="{notFree: !isFree}">
			<view class="cbt-top">
				<text :class="{tempColor: cardInfo.atk2, weakColor: cardInfo.atk2===0}">{{cardInfo.atk2+""||cardInfo.atk}}</text>
				<text>{{chs[cardInfo.ch]}}</text>
				<image :src="`../../static/play/cost${cost}.png`" mode="heightFix"></image>
			</view>
			<view class="cbt-mid" :style="{backgroundImage: `url(${imgUrl+cardInfo.ch}.png)`}">	
			</view>
			<view class="cbt-bot" :class="{tempColor: cardInfo.skill2, work: cardInfo.work}">
				{{skill[cardInfo.skill2] || skill[cardInfo.skill]}}
			</view>
		</view>
		<view class="skill-mask flex-center" v-if="isShowSkM && !cbtCardMode">
			<button size="mini" @click.stop="showSkill">发动效果</button>
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
				imgUrl: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/scene/scene",
			};
		},
		computed: {
			cost () {return this.cardInfo.type<2? 1 : 2},
			isShowSkM () {return this.cardIdx==this.actCardIdx&&this.cardInfo.skill!=99&&!this.cardInfo.work},
			skNum () {return this.cardInfo.skill2 || this.cardInfo.skill},
		},
		props: {
			cardInfo: Object,
			isFree: Boolean,
			cardIdx: Number,
			actCardIdx: {type: Number, default: -1},
			cbtCardMode: {type: Number, default: 0}, //0-点击会显示发动效果按钮
		},
		methods: {
			showSkill () {this.$emit("showSkill", {num:this.skNum, mode:0})},
		},

	}
</script>

<style lang="scss">
.cbt-card {
	width: 100%;
	height: 100%;
}	
.cbt-content {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	border-radius: 10rpx;
	padding: 10rpx;
	background-color: $cardC;
	border: 1rpx solid rgb(200,200,200);
	color: $fontC;
	.cbt-top {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		text:first-of-type {
			font: bold 40rpx $fontF;
		}
		text:last-of-type {
			font-size: 30rpx;
		}
		image {
			height: 45rpx;
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
	.work {
		text-decoration: line-through;
	}
}
.skill-mask {
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0,0.6);
	border-radius: 10rpx;
	top: 0;
	position: absolute;
	button {
		height: 60rpx;
		font: 27rpx/60rpx $fontF;
		color: white;
		background-image: linear-gradient(to bottom right, rgb(220, 201, 115), rgb(157, 109, 54));
	}
}
.weakColor {
	color: rgb(193, 73, 73);
}
.tempColor {
	color: rgb(52, 140, 154);
}
.notFree {
	border: 1rpx solid rgb(55, 154, 113) !important;
}
.text-mini {
	font-size: 25rpx !important;
}
</style>