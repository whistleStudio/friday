<template>
	<view class="skill-card-list">
	  <ul v-if="actSk.num!=11&&actSk.num!=52" class="mgb-30" v-for="(v,k,i) in curFts" :key="i">
	  	<li v-for="(cv,ci) in v" :key="ci" @click="pickCard(100*i+ci, cv)"
			v-show="(100*i+ci)!==actCardIdx">
	  		<cbt-card :cardInfo="cv" :isFree="!i" :cbtCardMode="1" :cardIdx="100*i+ci" />
				<image v-if="pickIdx==(100*i+ci)" :src="`../../static/play/sk${actSk.num}.png`" 
				class="mark" mode="widthFix"></image>
	  	</li>
	  </ul>
		<!-- 查看x3  一阶段弃牌-->
		<ul v-if="actSk.mode==0&&actSk.num==11" >
			<li v-for="(v, i) in checkCards" :key="i" @click="pickCard(i)">
				<cbt-card :cardInfo="v" :isFree="false" :cbtCardMode="1" :cardIdx="i" />
				<image v-if="pickIdx==i" :src="`../../static/play/sk11.png`" class="mark" mode="widthFix"></image>
			</li>
		</ul>
		<!-- 查看x3 二阶段排序 -->
		<ul v-if="actSk.mode==2&&actSk.num==11" >
			<li v-for="(v, i) in checkCards" :key="i" @click="sortCard(i)">
				<cbt-card :cardInfo="v" :isFree="false" :cbtCardMode="1" :cardIdx="i" />
				<image v-if="imgOrder[i]>=0" :src="`../../static/play/sortoken${imgOrder[i]}.png`" class="mark" mode="widthFix"></image>
			</li>
		</ul>
		<!-- 海盗 52 翻开的战斗牌只算一半(必须包含老化牌) -->
		<view class="hint52" v-if="actSk.num===52">已选择卡牌数:<text>{{decayL+fightCount}}</text> / {{Math.ceil(ftL/2)}}</view>
		<ul v-if="actSk.num===52" class="mgb-30" v-for="(v,k,i) in curFts" :key="i">
			<li v-for="(cv,ci) in v" :key="ci" @click="pickFightCard(cv, 100*i+ci)">
				<cbt-card :cardInfo="cv" :isFree="!i" :cbtCardMode="1" :cardIdx="100*i+ci" />
				<image v-if="cv.type===2" :src="`../../static/play/fight0.png`" class="mark" mode="widthFix" />
				<image v-if="cv.type!==2&&fightIdx[ci]" :src="`../../static/play/fight1.png`" class="mark" mode="widthFix" />
			</li>
		</ul>
	</view>
</template>

<script>
	import {mapState} from "vuex"
	export default {
		name:"skill-card-list",
		data() {
			return {
				pickIdx: -1,
				imgOrder: [],
				order: 0,
				fightCount: 0,
			};
		},
		computed: {
			...mapState({
				curFts: state => state._gameInfo.curFts,
				checkCards: state => state._gameInfo.checkCards,
				fightIdx: state => state._gameInfo.fightIdx,
			}),
			ftL () {
				return this.curFts.na.length + this.curFts.sp.length
			},
			decayL () {
				let count = 0
				for (let v of Object.values(this.curFts)) {
					v.forEach((cv, ci) => {
						if (cv.type === 2) count++
					})
				}
				return count
			},
		},
		props: {
			cardList: Array,
			actCardIdx: Number,
			actSk: Object,
		},
		methods: {
			pickCard (idx, v) {
				if (this.pickIdx !== idx&&v.atk2<=v.atk) {
					this.pickIdx = idx
				} else this.pickIdx = -1
				this.$emit("pickCard", idx)
			},
			sortCard (i) {
				console.log("sortCard---", i)
				if (this.imgOrder[i]>=0) {
					this.imgOrder=Array(3).fill(-1)
					this.order = 0
				} else {
					// this.imgOrder[i] = this.order
					this.$set(this.imgOrder, i, this.order)
					this.$store.commit("changeObjVal", {k1: "_gameInfo", k2: "checkCardOrder", v: this.imgOrder})
					this.order ++
				}
			},
			pickFightCard (card, idx) {
				if (card.type != 2) {
					// undefined || 0
					if (!this.fightIdx[idx]) {
						if (this.fightCount+this.decayL<Math.ceil(this.ftL/2)){this.$store.commit("setFightIdx", {flag:true, idx}); this.fightCount++;}
					} else {this.$store.commit("setFightIdx", {flag:false, idx}); this.fightCount--;}
				}
			}
		},
		created () {
			this.imgOrder = Array(this.checkCards.length).fill(-1)
			// console.log("skbox actSk", this.actSk)
		}
	}
</script>

<style lang="scss">
	.skill-card-list {
		height: 100%;
		overflow: auto;
		box-sizing: border-box;
		padding: 20rpx;
		ul {
			display: flex;
			flex-wrap: wrap;
			li {
				margin-bottom: 20rpx;
				flex: none;
				width: 200rpx;
				height: 300rpx;
				border-radius: 10rpx;
				position: relative;
				&:not(:nth-of-type(3n)) {
					margin-right: 16rpx;
				}
				.mark {
					position: absolute;
					right: 10rpx;
					bottom: 10rpx;
					width: 150rpx;
					
				}
			}	
		}
		.hint52 {
			font: 30rpx/50rpx $fontF;
			vertical-align: middle;
			>text {
				margin: 0 10rpx;
				display: inline-block;
				color: white;
				font: 30rpx/50rpx $fontF !important;
			}
		}
	}

</style>