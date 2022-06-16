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
		<view class="choose-card">
			<u-overlay :show="isShowAdv" @click="show = false" class="flex-center">
				<view class="wrap flex-col-rowcenter">
					<view class="uni-margin-wrap">
						<swiper class="swiper" circular indicator-dots>
							<swiper-item v-for="(v,i) in advCards2" :key="i">
								<!-- :style="{backgroundImage: `url(@/static/play/friday${v}.png)`}" -->
								<view class="swiper-item" :style="{backgroundImage: `url(/static/play/friday${v}.png)`}"></view>
							</swiper-item>
						</swiper>
					</view>
					<button size="mini" type="primary">确定</button>
				</view>
			</u-overlay>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: {
					bg: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/playbg-09.png",
					info: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/info-02.png",
					combatIcon: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/combat"
				},
				isShowAdv: true,
				advCards2: [0,1]
			}
		},
		methods: {
			
		},
		onLoad (q) {

		}
	}
</script>

<style lang="scss">
.content {
	width: 100%;
	height: 100vh;
	background: center/cover no-repeat;
	box-sizing: border-box;
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
		background-color: white;
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
					// background-color: green;
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
	.choose-card {
		.wrap {
			height: 900rpx;
			background-color: white;
			view:first-of-type {
				width: 80%;
				height: 800rpx;
				background-color: pink;
				.swiper {
					height: 800rpx;
					// background-color: orange;
					.swiper-item {
						width: 100%;
						// background-color: red;
						background:  center/contain no-repeat;

					}
				}
			}
		}
		button {
			margin-top: 30rpx;
		};
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
