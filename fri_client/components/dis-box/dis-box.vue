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
				<ul class="dis-show">
					<li v-for="(v,i) in Array(10)" :key="i"></li>
				</ul>
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
			};
		},
		methods: {
			closePopup () {
				this.$emit("closePopup")
			},
			changeTag (ev) {this.curIdx = ev.index}
		}
	}
</script>

<style lang="scss">
.dis-box {
	width: 100%;
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
		height: 100%;
		.dis-show {
			height: calc(100% - 160rpx);
			background-color: lightcyan;
			box-sizing: border-box;
			overflow-y: auto;
			display: flex;
			flex-wrap: wrap;
			li {
				flex: none;
				margin-bottom: 20rpx;
				margin-right: 20rpx;
				width: 200rpx;
				height: 300rpx;
				background-color: #fff;
			}
		}
	}
}
</style>