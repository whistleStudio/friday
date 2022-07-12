<template>
	<view v-if="isInitOk" class="content pdt-30 flex-col-rowcenter" :style="{backgroundImage: `url(${imgUrl.bg})`}">
		<view class="adventure mgb-30" v-if="curAdvCard">
			<view class="headbar">
				<text>阶段I 剩余冒险:{{advs.length}}</text>
				<text>冒险牌库:{{advs.length}}</text>
			</view>
			<view class="main" @touchstart="advTouchStart" @touchend="advTouchEnd">
				<adv-card :drawCount="drawCount" :temp="temp"></adv-card>
			</view>
		</view>
		<view class="action flex-center" v-if="curAdvCard">
			<button size="mini" @click="fight">挑战</button>
			<button size="mini" :class="{bleed: drawCount>=curDraw}" @click="draw">抽牌</button>
		</view>	
		<view class="combat">
			<view class="headbar">
				<ul>
					<li v-for="(v,i) in Array(3)" :key="i">
						<image :src="imgUrl.combatIcon+i+'.png'" mode="heightFix"></image>
						<text>{{cbtBar[i]}}</text>
					</li>
				</ul>
				<text>战斗牌库:{{fts.length}}</text>
			</view>
			<view class="main">
				<ul class="mgb-30" v-for="(v,k,i) in curFts" :key="i">
					<li v-for="(cv,ci) in v" :key="ci" @click="tapCbtCard(100*i+ci)">
						<cbt-card :cardInfo="v[ci]" :isFree="!i" 
						@showSkill="showSkill" @resetSkillUsed="resetSkillUsed"
						:cardIdx="100*i+ci" :actCardIdx="actCardIdx" :isSkillUsed="isSkillUsed"></cbt-card>
					</li>
				</ul>
				<view class="dis-btn" @click="isPopShow=true"></view>
			</view>
		</view>
    <!-- 冒险牌选择 -->
		<u-overlay :show="isOverlayShow&&!isBoss" :z-index ="999" opacity="0.6"
		@click="show = false" class="flex-col-rowcenter">
			<choose-adv v-if="isAdv2Show" @closeOverlay="isOverlayShow=false"></choose-adv>
			<rm-box v-else :disCount="advDim" @closeRm="closeRmBox"></rm-box>
		</u-overlay>
		<!-- 卡牌效果页 -->
		<u-overlay :show="isSkillShow" opacity="0.6">
			<skill-box :actSk="actSk" :actCardIdx="actCardIdx"
			@closeSkill="resetSkillUsed" @useSkill="useSkill" @modifyDraw="modifyDraw"></skill-box>
		</u-overlay>
		<!-- 弃牌区 -->
		<u-popup :show="isPopShow" mode="left">
		  <view class="pop-box">
		      <dis-box @closePopup="isPopShow=false"></dis-box>
		  </view>
		</u-popup>
	</view>
</template>

<script>
	import {harm} from "@/style/card.json"
	export default {
		data() {
			return {
				harm,
				drawCount: 0, actCardIdx: -1, 
				isOverlayShow: true, isAdv2Show: true, bleedHint: true, isPopShow: false, isSkillShow: false, isSkillUsed: false,
				imgUrl: {
					bg: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/playBg.png",
					combatIcon: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/icon/combat",
				},
				advTouch: {
					tim: "",
					isFlap: false
				},
				actSk: {
					num: -1,
					mode: -1
				},
				temp: {
					draw: 0
				}
			}
		},
		computed: {
			curAdvs: function () {return this.$sta._gameInfo.curAdvs},
			disAdv () {return this.$sta._gameInfo.disAdv},
			curAdvCard () {return this.$gts.curAdvCard},
			curDraw () {return this.$sta.isBoss ? this.curAdvCard.draw+this.temp.draw : this.curAdvCard.ch2+1+this.temp.draw},
			advs () {return this.$sta._cards.advDeck},
			fts () {return this.$sta._cards.ftDeck},
			curFts () {return this.$sta._gameInfo.curFts},
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
				let advHarm
				if (this.isBoss) advHarm = this.curAdvCard ? this.curAdvCard.atk : 99
				else advHarm = this.curAdvCard ? harm[this.curAdvCard.ch2][ph] : 99
				return advHarm - this.$gts.cbtCount
			},
			isBoss () {return this.$sta._gameInfo.isBoss},
			isInitOk () {return this.$sta._gameInfo.isInitOk}
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
					this.$store.commit("changeHp", this.advDim)
					uni.showToast({title:`挑战失败!\n生命-${this.advDim}`, icon:"none"}) 
					setTimeout(()=>{
						this.isOverlayShow = true
						this.isAdv2Show = false
					},500)
				}
				this.drawCount = 0
				this.resetTemp()
			},
			/* 抽牌 */
			draw () {
				if (this.fts.length || this.disFt.length) {
					this.draw1Card()
				} else uni.showToast({title:"牌库已空!", icon:"none"})
			},
			draw1Card () {
				if (this.drawCount>=this.curDraw) {
					uni.showModal({
						content: "继续抽牌将消耗1生命值\n是否进行?",
						success: res => {
							if (res.confirm) {
								this.$store.commit("changeHp", 1)
								if (this.fts.length) this.$store.commit("drawFtCard", 0)
								else {
									this.$store.dispatch("ftsRunOut")
									uni.showLoading({title: "岁月不饶人, 你似乎又衰老了些"})
									setTimeout(()=>{uni.hideLoading()},1500)
								}
							}
						}
					})
				}	else {this.$store.commit("drawFtCard"); this.drawCount++}
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
			},
			/* 激活技能 */
			tapCbtCard (idx) {
				if (this.actCardIdx === idx)
					this.actCardIdx = -1
				else this.actCardIdx = idx
				console.log("tap",this.actCardIdx, idx)
			},
			/* skill遮罩显示 */
			showSkill (actSk) {
				this.isSkillShow = true
				this.actSk = actSk
			},
			/* 技能使用情况改变 */
			useSkill (mode) {
				if (mode) {
					this.isSkillUsed=true
				} else this.isSkillShow = false
			},
			/* 重置技能使用情况 skill-box触发isSkillUsed=true, cbt-card监控isSkillUsed, 再触发reset -> 遮罩关闭,技能使用重置,激活索引置-1(发动效果图标小时)*/
			resetSkillUsed () {
				this.isSkillShow = false
				this.isSkillUsed = false
				this.actCardIdx = -1
			},
			/* 调整免费抽牌上限 */
			modifyDraw (n) {this.temp.draw += n},
			/* 重置temp */
			resetTemp () {
				this.temp.draw = 0
			}
		},
		onLoad (q) {
			setTimeout(()=>{
				this.$store.commit("chooseAdvCard")
			},500)
		},
	}
</script>

<style scoped src="./play.scss" lang="scss"></style>

