<template>
	<view class="dis-box">
			<view class="head">
				<view class="back" @click="closePopup"></view>
			</view>
			<view class="main">
				<u-sticky bgColor="#fff">
				  <u-tabs @change="changeTag" 
					:list="tagList" lineWidth="100rpx" lineHeight="8rpx" lineColor="rgb(167, 87, 49)" :itemStyle="tagStyle.item"></u-tabs>
				</u-sticky>
				<scroll-view scroll-y="true" class="dis-show" :style="{height: scrollH+'rpx'}">
					<ul class="flex-col-rowcenter">
						<li v-for="(v,i) in disList[curIdx]" :key="i">
							<dis-card :tag="curIdx" :cardInfo="v"></dis-card>
						</li>
					</ul>
				</scroll-view>
			</view>

	</view>
</template>

<script>
	export default {
		name:"dis-box",
		data() {
			return {
				tagList: [
					{name:"冒险弃牌"},
					{name:"战斗弃牌"},
					{name:"移除卡牌"}
				],
				tagStyle: {
					inactive: {},
					item: {fontWeight:"bold", width:"200rpx", height:'100rpx', boxSizing:"border-box", textAlign:"center", backgroundColor:"rgba(251, 255, 240, 1.0)"}
				},
				curIdx: 0,
				scrollH: 700,
			};
		},
	  computed: {
			disList () {return [this.$sta._gameInfo.disAdv,this.$sta._gameInfo.disFt,this.$sta._gameInfo.rm]},
		},
		methods: {
			closePopup () {
				this.$emit("closePopup")
			},
			changeTag (ev) {this.curIdx = ev.index}
		},
		created() {
			let {windowHeight, screenWidth,statusBarHeight} = uni.getWindowInfo()
			this.scrollH = 750 / screenWidth * windowHeight -230
		}
	}
</script>

<style lang="scss">
.dis-box {
	.head {
		width: 100%;
		height: 120rpx;
		box-sizing: border-box;
		.back {
			float: right;
			width: 120rpx;
			height: 60rpx;
			margin-top: 30rpx;
			background: url("@/static/play/back.png") center/contain no-repeat;
		}
	}
	.main {
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		.dis-show {
			ul {
			  box-sizing: border-box;
				padding: 20rpx;
				width: 100%;
				li {
					width: 100%;
					height: 100rpx;
					background-color: $cardC;
					border-radius: 5rpx;
					margin-bottom: 10rpx;
				}
			}
		}
	}
}
</style>