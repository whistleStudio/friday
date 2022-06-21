<template>
	<view class="content pdt-30 flex-col-rowcenter" :style="{backgroundImage: `url(${imgUrl.bg})`}">
		<view class="adventure mgb-30" v-if="curAdvCard">
			<view class="headbar">
				<text>阶段I 剩余冒险:{{advs.length}}</text>
				<text>弃牌堆:{{disAdv.length}}</text>
			</view>
			<view class="main" @touchstart="advTouchStart" @touchend="advTouchEnd">
				<view class="advImg" :style="{backgroundImage: `url(${imgUrl.advScene+curAdvCard.ch2}.png)`}">
					<image src="@/static/play/info.png" mode="widthFix"></image>
				</view>
				<view class="advInfo">
					<text>{{chs[curAdvCard.ch2]}}</text>
					<view class="advbox">
						<ul class="adv-phase">
							<li v-for="(v,i) in Array(3)" :key="i" :style="{backgroundColor:imgUrl.phColor[i]}">{{curAdvCard.harm[i]}}</li>
						</ul>
						<view class="drawNum"><text>{{curAdvCard.draw-drawCount}}</text></view>
					</view>
				</view>
			</view>
		</view>
		<view class="action flex-center" v-if="curAdvCard">
			<button size="mini" @click="fight">挑战</button>
			<button size="mini" :disabled="drawCount>=curAdvCard.draw" @click="draw">抽牌</button>
		</view>	
		<view class="combat">
			<view class="headbar">
				<ul>
					<li v-for="(v,i) in Array(3)" :key="i">
						<image :src="imgUrl.combatIcon+i+'.png'" mode="heightFix"></image>
						<text>{{cbtBar[i]}}</text>
					</li>
				</ul>
				<text>弃牌堆:{{disFt.length}}</text>
			</view>
			<view class="main">
				<ul class="mgb-30">
					<li v-for="(v,i) in naFts" :key="i">
						<cbt-card :cardInfo="naFts[i]"></cbt-card>
					</li>
				</ul>
				<ul>
					<li v-for="(v,i) in spFts" :key="i">
						<cbt-card :cardInfo="spFts[i]" :isFree="false"></cbt-card>
					</li>
				</ul>
			</view>
		</view>

		<u-overlay :show="isOverlayShow" :z-index ="999" :opacity="0.6"
		@click="show = false" class="flex-col-rowcenter">
			<view v-if="isAdvsOk&&adv2.isShow" class="box">
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
					<button @click="chooseAdv" size="mini" type="primary">确 定</button>
				</view>
			</view>
		</u-overlay>

	</view>
</template>

<script>
	import {chs} from "@/style/card.json"
	
	export default {
		data() {
			return {
				chs,
				imgUrl: {
					phColor:['rgb(98, 204, 141)','rgb(237, 223, 93)','rgb(247, 92, 110)'],
					bg: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/playbg-09.png",
					info: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/info-02.png",
					combatIcon: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/combat",
					adv: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/test/friday",
					advScene: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/test/scene"
				},
				isOverlayShow: true,
				adv2: {
					isShow: true,
					current: 0,
				},
				isAdvShowOk: false,
				advTouch: {
					tim: "",
					isFlap: false,
				},
				drawCount: 0,
			}
		},
		computed: {
			curAdvs: function () {return this.$sta._gameInfo.curAdvs},
			isAdvsOk: function () {return this.$sta._gameInfo.isAdvsOk},
			disAdv: function () {return this.$sta._gameInfo.disAdv},
			curAdvCard: function () {return this.curAdvs[this.adv2.current]},
			advs: function () {return this.$sta._cards.advDeck},
			fts: function () {return this.$sta._cards.ftDeck},
			naFts: function () {return this.$sta._gameInfo.curFts.na},
			spFts: function () {return this.$sta._gameInfo.curFts.sp},
			disFt: function () {return this.$sta._gameInfo.disFt},
			cbtBar: function () {return [
				this.$sta._gameInfo.hp,
				this.$gts.cbtCount,
				this.$sta._gameInfo.decayLvl
			]},
		},
		methods: {
			chooseAdv () {
				this.isOverlayShow = false
				this.adv2.isShow = false
				let disIdx = 1 - this.adv2.current
				this.$store.commit("discard", {card: this.curAdvs[disIdx], pile: "disAdv"})
			},
			swiperChange (ev) {this.adv2.current = ev.detail.current},
			/* 冒险区长按事件（待完善） */
			advTouchStart () {
				let start = 0
				this.advTouch.tim = setInterval(()=>{
					start++
					if (start>20) {
						this.advTouch.isFlap = true
					}
				},100)
			},
			advTouchEnd () {
				clearInterval(this.advTouch.tim)
				this.advTouch.isFlap = false
			},
			fight () {
				console.log(this.curAdvCard)
				console.log(this.adv2.current)
			},
			draw () {
				this.drawCount++
				if (this.fts.length>0) {
					this.$store.commit("drawFtCard")
				} else {
					this.$store.dispatch("ftsRunOut")
					uni.showLoading({content: "岁月不饶人，你似乎又衰老了些"})
					setTimeout(()=>{uni.hideLoading()},2000)
				}
			}
		},
		watch: {
		},
		onLoad (q) {
			setTimeout(()=>{
				this.$store.commit("chooseAdvCard")
			},500)
		},
	}
</script>

<style scoped src="./play.scss" lang="scss"></style>

