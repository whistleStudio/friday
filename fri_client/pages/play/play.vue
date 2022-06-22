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
						<cbt-card :cardInfo="naFts[i]" :isFree="1"></cbt-card>
					</li>
				</ul>
				<ul>
					<li v-for="(v,i) in spFts" :key="i">
						<cbt-card :cardInfo="spFts[i]" :isFree="2"></cbt-card>
					</li>
				</ul>
			</view>
		</view>

		<u-overlay :show="isOverlayShow" :z-index ="999" :opacity="0.6"
		@click="show = false" class="flex-col-rowcenter">
			<choose-adv v-if="isAdv2Show" @closeOverlay="isOverlayShow=false"
			@changeAdvCur="changeAdvCurrent" 
			></choose-adv>
			<rm-box v-else :disCount="advDim" @closeRm="closeRmBox"></rm-box>
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
					advScene: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/test/scene"
				},
				isOverlayShow: true,
				adv2Current: 0,
				isAdv2Show: true,
				advTouch: {
					tim: "",
					isFlap: false,
				},
				drawCount: 0,
			}
		},
		computed: {
			curAdvs: function () {return this.$sta._gameInfo.curAdvs},
			disAdv () {return this.$sta._gameInfo.disAdv},
			curAdvCard () {return this.curAdvs[this.adv2Current]},
			advs () {return this.$sta._cards.advDeck},
			fts () {return this.$sta._cards.ftDeck},
			naFts () {return this.$sta._gameInfo.curFts.na},
			spFts () {return this.$sta._gameInfo.curFts.sp},
			disFt () {return this.$sta._gameInfo.disFt},
			cbtBar () {return [
				this.$sta._gameInfo.hp,
				this.$gts.cbtCount,
				this.$sta._gameInfo.decayLvl
			]},
			advDim () {
				let ph = this.$sta._gameInfo.curPhase
				let advHarm = this.curAdvCard.harm[ph]
				return advHarm - this.$gts.cbtCount
			}
		},
		methods: {
			changeAdvCurrent (i) {this.adv2Current=i},
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
			/* 挑战 */	
			fight () {
				if (this.advDim<=0) {
					this.$store.commit("fightCheck", {res:1, card:this.curAdvCard})
					uni.showToast({title:"挑战成功!", icon:"none"})
					this.openAdvBox()
				} else {
					let curHp = this.$sta._gameInfo.hp - this.advDim
					this.$store.commit("changeObjVal", {k1:"_gameInfo", k2:"hp", v: curHp})
					uni.showToast({title:`挑战失败!\n生命-${this.advDim}`}) 
					setTimeout(()=>{
						this.isOverlayShow = true
						this.isAdv2Show = false
					},500)
				}
			},
			/* 抽牌 */
			draw () {
				this.drawCount++
				if (this.fts.length>0) {
					this.$store.commit("drawFtCard")
				} else {
					this.$store.dispatch("ftsRunOut")
					uni.showLoading({content: "岁月不饶人，你似乎又衰老了些"})
					setTimeout(()=>{uni.hideLoading()},2000)
				}
			},
			/* 打开冒险选择窗口 */
			openAdvBox () {
				setTimeout(()=>{
					this.$store.commit("chooseAdvCard")
					this.isOverlayShow = true
					this.isAdv2Show = true
				},500)
			},
			/* 关闭移除卡牌窗口 */
			closeRmBox (disCardNum) {
				if (disCardNum) uni.showToast({title:`共移除${disCardNum}张卡牌`,icon:"none"})
				this.$store.commit("fightCheck", {res:0, card:this.curAdvCard})
				this.openAdvBox()
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

