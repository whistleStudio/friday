<template>
	<view class="rm-box flex-col-rowcenter">
		<text class="mgb-30">选择移除游戏的卡牌: {{disNum}} / {{disCount}}</text>
		<ul class="mgb-50">
			<li v-for="(v,i) in naFts" :key="'na'+i" @click="swapSta(0,i)">
				<cbt-card :cardInfo="naFts[i]"></cbt-card>
				<image v-show="curFtLis.na[i]" src="@/static/play/discard.png" mode="widthFix"></image>
			</li>
			<li v-for="(v,i) in spFts" :key="'sp'+i"  @click="swapSta(1, i)">
				<cbt-card :cardInfo="spFts[i]"></cbt-card>
				<image v-show="curFtLis.sp[i]" src="@/static/play/discard.png" mode="widthFix"></image>
			</li>
		</ul>
		<button @click="rmCard" size="mini" class="btn200x60" >确定</button>
	</view>
</template>

<script>
	import Vue from "vue"
	export default {
		name:"rm-box",
		data() {
			return {
				curFtLis: {na:[],sp:[]},
				disNum: 0,
				disCardNum: 0,
			};
		},
		computed: {
			naFts: function () {return this.$sta._gameInfo.curFts.na},
			spFts: function () {return this.$sta._gameInfo.curFts.sp},
 		},
		props: {
			disCount: {type: Number, default: 0},
		},
		methods: {
			swapSta (g, i) {
				let arr = g ? this.curFtLis.sp : this.curFtLis.na
				let cardArr = g ? this.spFts : this.naFts
				let cost = cardArr[i].type===2 ? 2 : 1
				// console.log(arr[i])
				if (arr[i]||this.disNum<=this.disCount-cost) {
					if (arr[i]) {this.disNum -= cost; this.disCardNum--;}
					else {this.disNum += cost; this.disCardNum++;}
					this.$set(arr, i, !arr[i])
				} else uni.showToast({title: "无法移除更多的卡牌",icon:"none"})
			},
			rmCard () {
				if(this.disCardNum) {
					let rmCardList = {na:[], sp:[]}
					this.curFtLis.na.forEach((v, i) => {if(v) rmCardList.na.push(this.naFts[i])})
					this.curFtLis.sp.forEach((v, i) => {if(v) rmCardList.sp.push(this.spFts[i])})
					this.$store.commit("removeCard", rmCardList)
				}
				this.$emit("closeRm", this.disCardNum)
			}
		},
		beforeMount () {
			this.naFts.forEach(e => this.curFtLis.na.push(false))
			this.spFts.forEach(e => this.curFtLis.sp.push(false))
		}
	}
</script>

<style lang="scss">
	.rm-box {
		width: 100%;
		height: 100%;
		justify-content: center;
		text {
			color: whitesmoke;
		}
		ul {
			padding: 0 22rpx 20rpx ;
			width: 680rpx;
			height: 700rpx;
			background-color: rgb(235, 214, 177);
			border-radius: 10rpx;
			display: flex;
			flex-wrap: wrap;
			box-sizing: border-box;
			overflow-y: auto;
			li {
				margin-top: 20rpx;
				flex: none;
				width: 200rpx;
				height: 300rpx;
				background-color: rgb(255, 250, 232);
				border-radius: 10rpx;
				position: relative;
				&:not(:nth-of-type(3n)) {
					margin-right: 16rpx;
				}
				>image {
					position: absolute !important;
					right: 10rpx;
					bottom: 10rpx;
					width: 150rpx;
				}
			}
		}
	}
</style>