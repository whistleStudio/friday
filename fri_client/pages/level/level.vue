<template>
	<view class="content flex-col-rowcenter" :style="{backgroundImage: `url(${imgUrl.bg})`}">
		<view class="head">
			生 存 难 度
		</view>
		<view class="main">
			<ul class="flex-col-rowcenter">
				<li v-for="(v, i) in mainInfo" :key="i" @click="chooseLvl(i)">
					<text>{{v.txt}}</text>
					<image v-if="lvl<i" :src="imgUrl.lock" mode="heightFix"></image>
				</li>
			</ul>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: {
					bg: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/cardback.png",
					lock: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/icon/lock.png",
				},
				mainInfo: [
					{txt: "普通"},
					{txt: "残酷"},
					{txt: "灾难"},
					{txt: "梦魇"}
				]
			}
		},
		computed: {
			lvl: function () {return this.$sta._userInfo.lvl}
		},
		methods: {
			chooseLvl (i) {
				if (i <= this.lvl) {
					uni.navigateTo({
						url: `/pages/play/play?lvl=${i}`,
						success: ()=> {
							this.$store.commit("changeObjVal", {k1:"_gameInfo", k2:"glvl", v:i})
							this.$store.commit("initDeck")
						}
					})
				} else {
					uni.showToast({
						title: `请先通关${this.mainInfo[this.lvl].txt}难度`,
						icon: "none"
					})
				}
			}
		}
	}
</script>

<style lang="scss">
.content {
	width: 100%;
	height: 100vh;
	background: center/cover no-repeat;
	.head {
		// height: 80rpx;
		color: rgb(248, 249, 238);
		font: bold 60rpx/80rpx $fontF;
		// background-color: white;
		margin: 7vh 0;
	}
	.main {
		margin-top: 5vh;
		width: 65%;
		height: 700rpx;
		// background-color: red;
		ul {
			width: 100%;
			height: 100%;
			justify-content: space-evenly;
			li {
				text-align: center;
				width: 100%;
				height: 90rpx;
				font: bold 45rpx/90rpx $fontF;
				background-color: rgb(231, 227, 163);
				border-radius: 10rpx;
				color: rgb(19, 52, 24);
				box-sizing: border-box;
				position: relative;
				box-shadow: 1px 1px 2px 2px darkslategray;
				image {
					right: 30rpx;
					top: 15rpx;
					position: absolute;
					height: 60rpx;
				}
			}
		}
	}
}
</style>
