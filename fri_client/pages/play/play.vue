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
				}
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
				height: 90rpx;
				li {
					display: flex;
					align-items: center;
					width: 120rpx;
					height: 50rpx;
					// background-color: green;
					font-size: 40rpx;
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
}
.headbar {
	width: 100%;
	height: 90rpx;
	line-height: 90rpx;
	background-color: lightpink;
	margin-bottom: 30rpx;
	box-sizing: border-box;
}
.main {
	width: 100%;
	height: calc(100% - 120rpx);
	background-color: orange;
}
</style>
