<template>
	<view class="dis-card">
		<view v-if="!tag" class="card-scene" :style="{backgroundImage: `url(${imgUrl+cardInfo.ch2}.png)`}"></view>
		<view v-else class="card-scene" :style="{backgroundImage: `url(${imgUrl+cardInfo.ch}.png)`}"></view>
		<ul v-if="!tag" class="card-data">
			<li> <image :src="advIcon[0]" mode="heightFix"></image><text>{{cardInfo.ch2+1}}</text></li>
			<li> 
				<image :src="advIcon[1]" mode="heightFix"></image>
				<ul>
					<li v-for="(v,i) in harm[cardInfo.ch2]" :key="i" 
					class="harm-num" :style="{color: phColor[i]}">{{v}}</li>
				</ul>
			</li>
		</ul>
		<ul v-else class="card-data">
			<li v-for="(v,i) in Array(2)" :key="i">
				<image :src="cbtIcon[i]" mode="heightFix"></image>
				<text v-if="!i" class="atk-text">{{cardInfo.atk}}</text>
				<text v-else>{{skill[cardInfo.skill]}}</text>
			</li>
		</ul>
	</view>
</template>

<script>
	import {skill,harm} from "@/style/card.json"
	
	export default {
		name:"dis-card",
		data() {
			return {
				skill,harm,
				imgUrl: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/scene/scene",
				advIcon: [
					"../../static/play/drawcard.png","../../static/play/harm.png"
				],
				cbtIcon: [
					"../../static/play/combat.png","../../static/play/skill.png"
				],
				phColor:['rgb(98, 204, 141)','rgb(237, 223, 93)','rgb(247, 92, 110)']
			};
		},
		props: {
			tag: {default:0, type:Number},
			cardInfo: Object
		}
	}
</script>

<style lang="scss">
	.dis-card {
		width: 100%;
		height: 100rpx;
		box-sizing: border-box;
		padding: 10rpx;
		display: flex;
		align-items: center;
		.card-scene {
			width: 80rpx;
			height: 80rpx;
			background: center/cover no-repeat;
		}
		.card-data{
			margin-left: 60rpx;
			height: 60rpx;
			display: flex;
			>li {
				display: flex;
				align-items: center;
				margin-right: 50rpx;
				>image {
					height: 60rpx;
					margin-right: 10rpx;
				}
				.atk-text {
					width: 46rpx;
				}
				>ul {
					display: flex;
					.harm-num {
						&:not(:last-of-type):after {
							content: "/";
							color: gainsboro;
							margin: 0 10rpx;
						}
					}
				}
			}

		}
	}

</style>