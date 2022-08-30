<template>
	<view ref="end" class="end flex-col-rowcenter" :style="{backgroundImage: `url(${endInfo[gameRes].bgUrl})`}">
		<view class="main flex-col-rowcenter">
			<h1 class="title">{{endInfo[gameRes].title}}</h1>
			<view class="score flex-center">
				<text>{{score}}分</text>
			</view>
			<view class="next">
				next
			</view>
		</view>
		<view class="rank topInfo flex-center" @click="topInfoClick(0)">
			<text>排行榜</text><image src="../../static/end/ranking.png" mode="heightFix"></image>
		</view>
		<view class="calc topInfo flex-center" @click="topInfoClick(1)">
			<image src="../../static/end/info.png" mode="heightFix"></image> <text>计分规则</text>
		</view>
		<u-overlay :show="ol.show" @click="ol.show=false">
			<view class="wrap flex-center">
				<view v-if="ol.mode" class="ol-main">
					
				</view>
				<view v-else class="ol-main">
					<text>计分规则</text>
					<table>
						<tr>
							<th></th>
						</tr>
						<tr >
							<td></td>
						</tr>
					</table>
				</view>
			</view>
		</u-overlay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gameRes: 0,
				wH: 0,
				score: 0,
				ol: {
					show: false,
					mode: 0,
					tb: [
						["项目", "战斗卡(含弃牌堆)", "挑战者牌组衰老卡(含弃牌堆)", "击败的海盗", "剩余生命值", "未通过的冒险卡", "挑战难度", ]
					]
				},
				endInfo:[
					{
						title: "You Lose",
						bgUrl: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/defeat.png"
					},
					{
						title: "You Win",
						bgUrl: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/victory.jpg"
					}
				] 
			}
		},
		methods: {
			topInfoClick (mode) {
				this.ol.show = true
				this.ol.mode = mode
			}
		},
		onLoad (p) {
			console.log(typeof p.res, p.res)
			uni.getSystemInfo({
				success: info => {
					// console.log(this.$refs.end)
					this.wH = info.windowHeight
				}
			})
			if (p.res==1) {
				this.gameRes = p.res
			}
		},
		onReady () {
			this.$refs.end.$el.style.height = this.wH + "px"
		}
 	}
</script>

<style lang="scss">
	.end {
		width: 100%;
		background: white center/cover no-repeat;
		justify-content: center;
		.main {
			width: 600rpx;
			height: 750rpx;
			// background-color: red;
			.title {
				color: white;
				font-size: 100rpx;
			}
			.score {
				margin-top: 50rpx;
				height: 100rpx;
				>text {
					font: 70rpx/100rpx $fontF;
				}
				>image {
					width: 40rpx;
					height: 40rpx;
				}
			}
			.next {
				color: $gray50;
				width: 400rpx;
				font: 45rpx/80rpx $fontF;
				text-align: center;
				background-color: rgba(225, 225, 225, 0.8);
				border-radius: 10rpx;
				margin-top: auto;
				box-shadow: 1px 1px 1px 1px dimgray;
			}
		}
		.rank {
			width: 200rpx;
			// background-color: lightgoldenrodyellow;
			right: 50rpx;
			>image {
				width: 44rpx;
				height: 50rpx;
				margin-left: 20rpx;
			}
		}
		.calc {
			left: 50rpx;
			>image {
				width: 48rpx;
				height: 48rpx;
				margin-right: 20rpx;
			}
		}
		.topInfo {
			position: absolute;
			line-height: 65rpx;
			top: 70rpx;
			>text {
				color: rgb(97, 67, 51);
				font: bold 31rpx/65rpx $fontF;
			}
			// border-bottom: 1px solid rgba(0, 90, 135, 0.1);
		}
		.wrap {
			width: 100%;
			height: 100%;
			.ol-main {
				width: 600rpx;
				height: 800rpx;
				background-color: ghostwhite;
				border-radius: 10rpx;
			}
		}
	}
</style>
