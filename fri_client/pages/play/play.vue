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
						<cbt-card :cardInfo="cv" :isFree="!i" 
						@showSkill="showSkill" 
						:cardIdx="100*i+ci" :actCardIdx="actCardIdx" ></cbt-card>
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
			@closeSkill="closeSkill" @modifyDraw="modifyDraw"></skill-box>
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
	import {mapState} from "vuex"
	import {harm} from "@/style/card.json"
	import advMethods from "./advMethods.js"
	import actionMethods from "./actionMethods.js"
	import combatMethods from "./combatMethods.js"
	
	export default {
		data() {
			return {
				harm,
				drawCount: 0, actCardIdx: -1, 
				isOverlayShow: true, isAdv2Show: true, bleedHint: true, isPopShow: false, isSkillShow: false, 
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
			...mapState({
				curAdvs: state => state._gameInfo.curAdvs,
				disAdv: state => state._gameInfo.disAdv,
				curFts: state => state._gameInfo.curFts,
				naFts: state => state._gameInfo.curFts.na,
				spFts: state => state._gameInfo.curFts.sp,
				disFt: state => state._gameInfo.disFt,
				isBoss: state => state._gameInfo.isBoss,
				isInitOk: state => state._gameInfo.isInitOk,
				advs: state => state._cards.advDeck,
				fts: state => state._cards.ftDeck,
			}),
			curAdvCard () {return this.$gts.curAdvCard},
			curDraw () {return this.$sta.isBoss ? this.curAdvCard.draw+this.temp.draw : this.curAdvCard.ch2+1+this.temp.draw},
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
		},
		methods: {
		  /* -------------冒险区(待完善)-------------- */
			advTouchStart () {advMethods.call(this).advTouchStart()},
			advTouchEnd () {advMethods.call(this).advTouchEnd()},
			
			/* -----------行动区--------------- */
			fight () {actionMethods.call(this).fight()}, //挑战按钮
			openAdvBox () {actionMethods.call(this).openAdvBox()}, //挑战成功, 打开冒险选择窗口
			giveAdvCard () {actionMethods.call(this).giveAdvCard()}, //冒险窗口, 派牌
			draw () {actionMethods.call(this).draw()}, //抽牌按钮
			draw1Card () {actionMethods.call(this).draw1Card()},
			
			/* -----------战斗区------------------- */ 
			tapCbtCard (idx) {combatMethods.call(this).tapCbtCard(idx)}, //点击战斗牌,显示发动效果遮罩
			showSkill (actSk) {combatMethods.call(this).showSkill(actSk)}, //点击发动效果, skill-box遮罩显示
			closeSkill () {combatMethods.call(this).closeSkill()}, // 取消/确定, 关闭skill-box遮罩
			
			/* ------------其他---------------------- */
			// 关闭移除卡牌窗口
			closeRmBox (disCardNum) {
				if (disCardNum) uni.showToast({title:`共移除${disCardNum}张卡牌`,icon:"none"})
				this.$store.commit("fightCheck", {res:0, card:this.curAdvCard})
				this.openAdvBox()
			},
			// 调整免费抽牌上限
			modifyDraw (n) {this.temp.draw += n},
			// 重置temp
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

