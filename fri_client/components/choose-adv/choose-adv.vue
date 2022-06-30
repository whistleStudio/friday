<template>
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
			<button @click="chooseAdv" class="btn200x60" size="mini" type="primary">确 定</button>
		</view>
	</view>
</template>

<script>
	export default {
		name:"choose-adv",
		data() {
			return {
				adv2Current: 0,
				imgUrl:{
					adv: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/adv/adv",
				}
			};
		},
		computed: {
			curAdvs: function () {return this.$sta._gameInfo.curAdvs},
			isAdvsOk: function () {return this.$sta._gameInfo.isAdvsOk},
		},
		methods: {
			swiperChange (ev) {
				this.adv2Current = ev.detail.current
				// this.$emit("changeAdvCur", this.adv2Current)
				this.$store.commit("changeObjVal", {k1:"_gameInfo", k2:"curAdvIdx", v:this.adv2Current})
			},
			chooseAdv () {
				this.$emit("closeOverlay")
				let disIdx = 1 - this.adv2Current
				this.$store.commit("discard", {card: this.curAdvs[disIdx], pile: "disAdv"})
			},
		}
	}
</script>

<style lang="scss">
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
		}
	}
</style>