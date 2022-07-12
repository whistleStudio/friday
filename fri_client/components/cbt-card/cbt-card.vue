<template>
	<view class="">
		<view class="cbt-content flex-col-rowcenter" :class="{notFree: !isFree}">
			<view class="cbt-top">
				<text>{{cardInfo.atk2||cardInfo.atk}}</text>
				<text>{{chs[cardInfo.ch]}}</text>
				<image :src="`../../static/play/cost${cost}.png`" mode="heightFix"></image>
			</view>
			<view class="cbt-mid" :style="{backgroundImage: `url(${imgUrl+cardInfo.ch}.png)`}">	
			</view>
			<view class="cbt-bot" :class="{sk2: cardInfo.skill2, notWork: !isWork}">
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
				isWork: true,
			};
		},
		computed: {
			cost () {return this.cardInfo.type<2? 1 : 2},
			isShowSkM () {return this.cardIdx==this.actCardIdx&&this.cardInfo.skill!=99&&this.isWork},
			skNum () {return this.cardInfo.skill2 || this.cardInfo.skill}
		},
		props: {
			cardInfo: Object,
			isFree: Boolean,
			cardIdx: Number,
			actCardIdx: {type: Number, default: -1},
			isSkillUsed: {type: Boolean, default: false},
			cbtCardMode: {type: Number, default: 0}
		},
		methods: {
			showSkill () {this.$emit("showSkill", {num:this.skNum, mode:0})},
		},
		watch: {
			isSkillUsed (newV) {
				if (newV) {
					// console.log("watch isSkillUsed", this.cardIdx, this.actCardIdx)
					// 校验发动效果卡牌 是否为 当前卡牌
					if (this.cardIdx === this.actCardIdx) {
						this.isWork = false
						// 父isSkillUsed重置为false
						this.$emit("resetSkillUsed")
					}
				}
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
	background-color: $cardC;
	border: 1rpx solid rgb(200,200,200);
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
	.notWork {
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
.sk2 {
	color: rgb(52, 140, 154);
}
.notFree {
	border: 1rpx solid rgb(55, 154, 113) !important;
}
.text-mini {
	font-size: 25rpx !important;
}
</style>