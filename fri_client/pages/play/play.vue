<template>
	<view class="content pdt-30 flex-col-rowcenter" :style="{backgroundImage: `url(${imgUrl.bg})`}">
		<view class="adventure mgb-30" v-if="curAdvCard">
			<view class="headbar">
				<text>阶段I 剩余冒险:{{advs.length}}</text>
				<text>弃牌堆:{{disAdv.length}}</text>
			</view>
			<view class="main">
				<view class="advImg" :style="{backgroundImage: `url(${imgUrl.advScene+curAdvCard.ch2}.png)`}">
					<image src="@/static/play/info.png" mode="widthFix"></image>
				</view>
				<view class="advInfo">
					<text>{{chs[curAdvCard.ch2]}}</text>
					<view class="advbox">
						<ul class="adv-phase">
							<li v-for="(v,i) in Array(3)" :key="i" :style="{backgroundColor:imgUrl.phColor[i]}">{{curAdvCard.harm[i]}}</li>
						</ul>
						<view class="drawNum"><text>{{curAdvCard.draw}}</text></view>
					</view>
				</view>
			</view>
		</view>
		<view class="action flex-center">
			<button size="mini" @click="fight">挑战</button>
			<button size="mini" @click="draw">抽牌</button>
		</view>	
		<view class="combat">
			<view class="headbar">
				<ul>
					<li v-for="(v,i) in Array(4)" :key="i">
						<image :src="imgUrl.combatIcon+i+'.png'" mode="heightFix"></image>
						<text>11</text>
					</li>
				</ul>
				<text>弃牌堆:10</text>
			</view>
			<view class="main">
				<ul class="mgb-30">
					<li></li>
				</ul>
				<ul>
					<li></li>
				</ul>
			</view>
		</view>

			<u-overlay :show="adv2.isShow" :z-index ="999" :opacity="0.6"
			@click="show = false" class="flex-col-rowcenter">
				<view v-if="isAdvsOk" class="box">
					<text>请选择一个冒险</text>
					<view class="wrap flex-col-rowcenter">
						<view class="uni-margin-wrap">
							<swiper class="swiper" circular @change="swiperChange"
							indicator-dots indicator-color="rgba(255,255,255,0.2)" indicator-active-color="rgba(255,255,255,0.6)">
								<swiper-item v-for="(v,i) in curAdvs" :key="i">
									<view class="swiper-item" :style="{backgroundImage: `url(${imgUrl.adv+v.id}.png)`}"></view>
								</swiper-item>
							</swiper>
						</view>
						<button @click="chooseAdv" size="mini" type="primary">确 定</button>
					</view>
				</view>
			</u-overlay>

	</view>
</template>

<script>
	import {chs} from "@/style/card.json"
	
	export default {
		data() {
			return {
				chs,
				imgUrl: {
					phColor:['rgb(98, 204, 141)','rgb(237, 223, 93)','rgb(247, 92, 110)'],
					bg: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/playbg-09.png",
					info: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/info-02.png",
					combatIcon: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/combat",
					adv: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/test/friday",
					advScene: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/test/scene"
				},
				adv2: {
					list:[0,1],
					isShow: true,
					current: 0,
				},
				isAdvShowOk: false,
			}
		},
		computed: {
			curAdvs: function () {return this.$sta._gameInfo.curAdvs},
			isAdvsOk: function () {return this.$sta._gameInfo.isAdvsOk},
			disAdv: function () {return this.$sta._gameInfo.disAdv},
			curAdvCard: function () {return this.curAdvs[this.adv2.current]},
			advs: function () {return this.$sta._gameInfo.advs}
		},
		methods: {
			chooseAdv () {
				this.adv2.isShow = false
				let disIdx = 1 - this.adv2.current
				this.$store.commit("discard", {card: this.curAdvs[disIdx], pile: "disAdv"})
			},
			swiperChange (ev) {this.adv2.current = ev.detail.current},
			fight () {
				console.log(this.curAdvCard)
				console.log(this.adv2.current)
			}
		},
		watch: {
		},
		onLoad (q) {
			setTimeout(()=>{
				this.$store.commit("chooseAdvCard")
			},500)
		},
	}
</script>

<style lang="scss">
.content {
	width: 100%;
	height: 100vh;
	background: center/cover no-repeat;
	box-sizing: border-box;
	position: relative;
	/* 冒险区 */
	.adventure {
		width: 90%;
		height: 30%;
		background-color: white;
		border-radius: 10rpx;
		.headbar {
			text {
				&:first-of-type {
					
				}
				&:last-of-type {
					float: right;
				}
			}
		}
		.main {
			width: 100%;
			display: flex;
			align-items: center;
			padding: 0 20rpx;
			box-sizing: border-box;
			.advImg {
				width: 250rpx;
				height: 250rpx;
				background: red center/cover no-repeat;
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
				background-color: green;
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
	}
	/* 行动区 */
	.action {
		height: 5%;
		margin-bottom: 30rpx;
		width: 80%;
		button {
			width: 200rpx;
			height: 80rpx;
			font: 40rpx/80rpx $fontF;
		}
	}
	/* 战斗区 */
	.combat {
		width: 90%;
		height: 58%;
		border-radius: 10rpx;
		.headbar {
			ul {
				float: left;
				display: flex;
				align-items: center;
				height: 80rpx;
				li {
					display: flex;
					align-items: center;
					width: 120rpx;
					height: 50rpx;
					font-size: 35rpx;
					image {
						height: 100%;
						margin-right: 5rpx;
					}
					&:not(:last-of-type) {
						margin-right: 15rpx;
					}
				}
			}
			text {
				float: right;
			}
		}
		.main {
			overflow-y: auto;
			ul {
				li {
					height: 700rpx;
					background-color: cyan;
				}
			}
		}
	}
	/* 选冒险 模态 */
	.box {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text {
			font-size: 35rpx;
			margin: 0 auto;
			color: ghostwhite;
			margin-bottom: 20rpx;
		}
		.wrap {
			height: 900rpx;
			view:first-of-type {
				width: 80%;
				height: 800rpx;
				.swiper {
					height: 800rpx;
					.swiper-item {
						width: 100%;
						background:  center/contain no-repeat;
		
					}
				}
			}
			button {
				width: 200rpx;
				height: 60rpx;
				margin-top: 30rpx;
				font: bold 35rpx/60rpx $fontF;
			};
		}
	}

}

.headbar {
	width: 100%;
	height: 80rpx;
	line-height: 80rpx;
	background-color: lightpink;
	// margin-bottom: 30rpx;
	box-sizing: border-box;
}
.main {
	width: 100%;
	height: calc(100% - 80rpx);
	background-color: orange;
}
</style>
