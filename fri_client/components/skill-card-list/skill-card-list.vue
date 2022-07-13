<template>
	<view class="skill-card-list">
	  <ul class="mgb-30" v-for="(v,k,i) in curFts" :key="i">
	  	<li v-for="(cv,ci) in v" :key="ci" @click="pickCard(100*i+ci)"
			v-show="(100*i+ci)!==actCardIdx">
	  		<cbt-card :cardInfo="v[ci]" :isFree="!i" :cbtCardMode="1"  		
	  		:cardIdx="100*i+ci" ></cbt-card>
				<image v-if="pickIdx==(100*i+ci)" :src="`../../static/play/sk${actSk.num}.png`" 
				class="mark" mode="widthFix"></image>
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
				pickIdx: -1
			};
		},
		computed: {
			...mapState({
				curFts: state => state._gameInfo.curFts,
			})
		},
		props: {
			cardList: Array,
			actCardIdx: Number,
			actSk: Object,
		},
		methods: {
			pickCard (idx) {
				this.pickIdx = idx
				this.$emit("pickCard", idx)
			} 
		},
		created () {
			console.log(this.curFts)
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
	}

</style>