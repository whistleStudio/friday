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
		<view class="calc topInfo flex-center" @click="topInfoClick(0)">
			<image src="../../static/end/info.png" mode="heightFix"></image> <text>计分规则</text>
		</view>
		<view class="rank topInfo flex-center" @click="topInfoClick(1)">
			<text>排行榜</text><image src="../../static/end/ranking.png" mode="heightFix"></image>
		</view>
		<u-overlay :show="ol.show" @click="ol.show=false">
			<view class="wrap flex-center">
				<view v-if="ol.mode" class="ol-main">
					
				</view>
				<view v-else class="ol-main">
					<text class="calc-title">计分规则</text>
					<table>
						<tr>
							<th v-for="(v,i) in ol.tb" :key="i" align="left">{{v[0]}}</th>
						</tr>
						<tr class="calc-tr" v-for="(v,i) in ol.tb[0].length-1" :key="i">
							<td v-for="(cv, ci) in ol.tb" :key="ci">{{cv[i+1]}}</td>
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
						["项目", "战斗卡(含弃牌堆)", "挑战者牌组衰老卡(含弃牌堆)", "击败的海盗", "剩余生命值", "未通过的冒险卡", "挑战难度", ],
						["分值", "[战斗值]分/张", "-5分/张", "15分/张", "5分/点生命值", "-3分/张", "普通x1.0|困难x1.2|灾难x1.5|梦魇x2.0"]
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
				width: 620rpx;
				height: 800rpx;
				background-color: ghostwhite;
				border-radius: 10rpx;
				font-family: $fontF;
				padding: 20rpx;
				box-sizing: border-box;
				.calc-title {
					display: inline-block;
					width: 100%;
					line-height: 80rpx;
					border-bottom: 1px solid rgba(211, 204, 170, 0.4);
					color: seagreen;
					font-weight: bolder;
				}
				table {
					margin-top: 20rpx;
					border-collapse: collapse;
					tr:first-of-type {
						th {
							color: $gray50;
							border-bottom: 2px solid lightgray;
							line-height: 60rpx;
						}
					}
					.calc-tr {
						&:not(:last-of-type) {border-bottom: 1px solid rgba(200, 200, 200, 0.3);}
						td {
							font: 28rpx/60rpx $fontF;
						}
						
					}
				}
			}
		}
	}
</style>
