<template>
	<view class="content pdt-30 flex-col-rowcenter" :style="{backgroundImage: `url(${imgUrl.bg})`}">
		<view class="adventure mgb-30">
			<view class="headbar">
				<text>阶段I 剩余冒险:19</text>
				<text>弃牌堆:8</text>
			</view>
			<view class="main">
				
			</view>
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
				
			</view>
		</view>

			<u-overlay :show="adv2.isShow" :z-index ="999" :opacity="0.6"
			@click="show = false" class="flex-col-rowcenter">
				<view v-if="isAdvsOk" class="box">
					<text>请选择一个冒险</text>
					<view class="wrap flex-col-rowcenter">
						<view class="uni-margin-wrap">
							<swiper :current="adv2.current" class="swiper" circular 
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
	export default {
		data() {
			return {
				imgUrl: {
					bg: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/playbg-09.png",
					info: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/info-02.png",
					combatIcon: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/combat",
					adv: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/test/friday"
				},
				adv2: {
					list:[0,1],
					isShow: true,
					current: 0,
				},
				isAdvShowOk: false
			}
		},
		computed: {
			curAdvs: function () {return this.$sta._gameInfo.curAdvs},
			isAdvsOk: function () {return this.$sta._gameInfo.isAdvsOk}
		},
		methods: {
			chooseAdv () {
				this.adv2.isShow = false
			}
		},
		watch: {
			// isAdvsOk () {
			// 	this.$store.commit("chooseAdvCard")
			// 	setTimeout(()=>{
			// 		this.isAdvShowOk = true
			// 		console.log("curAdvs--", this.$sta._gameInfo.curAdvs)
			// 	},2000)
			// }
		},
		onLoad (q) {
			setTimeout(()=>{
				this.$store.commit("chooseAdvCard")
				// this.isAdvShowOk = true
			},1000)
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
	.adventure {
		width: 90%;
		height: 35%;
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
	}
	.combat {
		width: 90%;
		height: 60%;
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
	}
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
	margin-bottom: 30rpx;
	box-sizing: border-box;
}
.main {
	width: 100%;
	height: calc(100% - 110rpx);
	background-color: orange;
}
</style>
