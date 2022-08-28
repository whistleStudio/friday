<template>
	<view class="skill-box flex-center" v-show="isBoxShow">
		<view v-if="actSk.num>5 || (actSk.num==5&&actSk.mode)" class="skill-content flex-col-rowcenter">
			<text class="skMsg">{{skillMsg[actSk.num]}}</text>
			<text class="skSubMsg" v-if="isShowSubMsg">{{subMsg[`${actSk.num}_${actSk.mode}`]}}</text>
			<view class="main">
				<skill-card-list :actCardIdx="actCardIdx" :actSk="actSk" @pickCard="pickCard"></skill-card-list>
			</view>
			<view class="btn-group">
				<button class="btn200x60" @click="closeSkill" v-if="actSk.num!==52" size="mini" >取消</button>
				<button class="btn200x60" @click="useSkill" size="mini" type="primary">确定</button>
			</view>			
		</view>
	</view>
</template>

<script>
	import {skillMsg, subMsg} from "@/style/skillMsg.json"
	
	export default {
		name:"skill-box",
		data() {
			return {
				skillMsg, subMsg,
				pickCardIdx: -1,
				//解决小程序因执行速度慢导致 关闭前画面停留
				isBoxShow: true,
			};
		},
		computed: {
			isShowSubMsg () {let {num} = this.actSk; return num==5 || num==10 || num==11}
		},
		props: {
			actSk: Object,
			actCardIdx: Number,
		},
		methods: {
			closeSkill () {
				this.$emit("closeSkill")
				if (this.actSk.num == 11) this.$store.commit("resetCheckCards")
			},
			useSkill () {
				this.isBoxShow = false
				//mode-0默认/技能一阶段 | 2技能二阶段 | 1加倍
				let {num,mode} = this.actSk, actIdx = this.actCardIdx, pickIdx = this.pickCardIdx
				let payload
				// (1)除复制 海盗以外, 置为已使用状态
				if (num!=7&&num!=52)	this.$store.commit("useSkill", {actIdx, state: 1})
				// (2)查看*3
				if (num==11) {
					if (mode==0) {
						console.log("pickIdx------", pickIdx)
						if(pickIdx>=0) this.$store.commit("actEffect", {skIdx: num, pickIdx, actIdx})
						payload = {skIdx: num}
					} else {this.$store.commit("actEffect", {skIdx: num, pickIdx, actIdx, mode})}
				}
				// (3) 海盗52 砍一半
				if (num==52) this.$store.commit("actPrtEffect", 1)
				// (4)其他情况
				if (num!=11&&pickIdx>=0) {
					// 置底的若为免费抽取牌, 可免费抽牌数+1
					if (num===8&&pickIdx<100) {
						this.$emit("modifyDraw", 1)
					}
					// 交换x2 是否进行第2次
					if (num==10&&mode!=2) {
						let ft = actIdx<100 ? "na" : "sp", idx = actIdx<100 ? actIdx : actIdx-100
						let actCard = this.$sta._gameInfo.curFts[ft][idx] // 获得已激活的交换x2卡片
						payload = {skIdx: num, actCard, actIdx}
					}
					this.$store.commit("actEffect", {skIdx: num, pickIdx, actIdx})
				}
				
				this.$emit("closeSkill", payload)
			},
			pickCard (idx) {this.pickCardIdx=idx},
		},
		mounted () {
			let {num,mode} = this.actSk
			console.log("mounted actsk", this.actSk)
			if (num <= 5&&!mode) {
				uni.showModal({
					title: this.skillMsg[num],
					icon: "none",
					duration:1000
				})
				switch (num) {
					// 阶段-1
					case 0:
						setTimeout(()=>{this.$emit("closeSkill")},1200)
						break
					// hp+1
					case 1:
						this.$store.commit("changeHp", -1)
						break
					// hp+2
					case 2:
						this.$store.commit("changeHp", -2)
						break
					// draw+1
					case 3:
						this.$emit("modifyDraw", 1)
						break
					// draw+2
					case 4:
						console.log("modifyDraw 2")
						this.$emit("modifyDraw", 2)
					  break
					case 5:
						setTimeout(()=>{this.$emit("closeSkill")},1200)
						break
				}
				if (num&&num<=4) {
					setTimeout(()=>{
						this.$store.commit("useSkill", {actIdx: this.actCardIdx, state: 1})
						this.$emit("closeSkill")
					},1200)
				}
			}
			if (num==11&&mode==0) {
				this.$store.commit("genCheckCards")
			}
		}
	}
</script>

<style lang="scss">
	.skill-box {
		width: 100%;
		height: 100%;
		.skill-content {
			height: 990rpx;
			width: 100%;
			padding: 25rpx;
			background-color: rgb(249, 234, 221);
			.skMsg {
				color: $gray50;
				font: bold 31rpx/40rpx $fontF;
			}
			.skSubMsg {
				margin-top: 20rpx;
				font: 28rpx/40rpx $fontF
			}
			.main {
				height: 700rpx;
				width: 632rpx;
				margin-top: 20rpx;
			}
		}
		.btn-group {
			button:not(:last-of-type) {
				margin-right: 20rpx;
			}
		}
	}
</style>