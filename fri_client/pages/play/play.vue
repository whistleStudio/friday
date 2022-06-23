<template>
	<view class="content pdt-30 flex-col-rowcenter" :style="{backgroundImage: `url(${imgUrl.bg})`}">
		<view class="adventure mgb-30" v-if="curAdvCard">
			<view class="headbar">
				<text>阶段I 剩余冒险:{{advs.length}}</text>
				<text>弃牌堆:{{disAdv.length}}</text>
			</view>
			<view class="main" @touchstart="advTouchStart" @touchend="advTouchEnd">
				<adv-card :drawCount="drawCount"></adv-card>
			</view>
		</view>
		<view class="action flex-center" v-if="curAdvCard">
			<button size="mini" @click="fight">挑战</button>
			<button size="mini" :class="{bleed: drawCount>=curAdvCard.draw}" @click="draw">抽牌</button>
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
			<choose-adv v-if="isAdv2Show" @closeOverlay="isOverlayShow=false"></choose-adv>
			<rm-box v-else :disCount="advDim" @closeRm="closeRmBox"></rm-box>
		</u-overlay>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				drawCount: 0,
				isOverlayShow: true, isAdv2Show: true, bleedHint: true,
				imgUrl: {
					bg: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/playbg-09.png",
					combatIcon: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/combat",
				},
				advTouch: {
					tim: "",
					isFlap: false
				},
			}
		},
		computed: {
			curAdvs: function () {return this.$sta._gameInfo.curAdvs},
			disAdv () {return this.$sta._gameInfo.disAdv},
			curAdvCard () {return this.$gts.curAdvCard},
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
					uni.showToast({title:`挑战失败!\n生命-${this.advDim}`, icon:"none"}) 
					setTimeout(()=>{
						this.isOverlayShow = true
						this.isAdv2Show = false
					},500)
				}
			},
			/* 抽牌 */
			draw () {
				if (this.drawCount>=this.curAdvCard.draw) {
					uni.showModal({
						content: "继续抽牌将消耗1生命值\n是否进行?",
						success: res => {
							if (res.confirm) {
								let curHp = this.$sta._gameInfo.hp
								this.$store.commit("changeObjVal", {k1:"_gameInfo", k2:"hp", v:curHp-1})
								this.draw1Card()
							}
						}
					})
				}	else {if(this.fts.length>0||this.disFt.length>0) this.drawCount++; this.draw1Card();}			
			},
			draw1Card () {
				if (this.fts.length>0) {
					this.$store.commit("drawFtCard")
				} else {
					if (this.disFt.length>0) {
						this.$store.dispatch("ftsRunOut")
						uni.showLoading({content: "岁月不饶人,\n你似乎又衰老了些"})
						setTimeout(()=>{uni.hideLoading()},1500)
					} else {uni.showToast({title:"牌库已空", icon:"none"})}
				}
			},
			/* 打开冒险选择窗口 */
			openAdvBox () {
				setTimeout(()=>{
					if (this.advs.length===1) {
						uni.showModal({
							content: "还剩一张冒险牌, 可放弃挑战进入下一阶段",
							cancelText: "放弃",
							confirmText: "继续",
							success: res => {
								if (res.confirm) this.giveAdvCard()
								else if (res.cancel) {
									this.$store.commit("changeObjVal", {k1:"_gameInfo", k2:"isNextPhase", v:true})
									this.giveAdvCard(true)
								}
							}
						})
					} else {
						this.giveAdvCard()
					}
				},500) 
			},
			/* 请求派发冒险牌 */
			giveAdvCard (isNext=false) {
				this.$store.commit("chooseAdvCard")
				this.isOverlayShow = true
				this.isAdv2Show = true
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

