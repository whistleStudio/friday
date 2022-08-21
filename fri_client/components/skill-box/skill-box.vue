<template>
	<view class="skill-box flex-center">
		<view v-if="actSk.num>5 || (actSk.num==5&&actSk.mode)" class="skill-content flex-col-rowcenter">
			<text>{{skillMsg[actSk.num]}}</text>
			<view class="main">
				<skill-card-list :actCardIdx="actCardIdx" :actSk="actSk"
				@pickCard="pickCard"></skill-card-list>
			</view>
			<view class="btn-group">
				<button class="btn200x60" @click="closeSkill" 
				size="mini" >取消</button>
				<button class="btn200x60" @click="useSkill" 
				size="mini" type="primary">确定</button>
			</view>			
		</view>
	</view>
</template>

<script>
	import {skillMsg} from "@/style/skillMsg.json"
	
	export default {
		name:"skill-box",
		data() {
			return {
				skillMsg,
				pickCardIdx: -1,
			};
		},
		props: {
			actSk: Object,
			actCardIdx: Number,
		},
		methods: {
			closeSkill () {this.$emit("closeSkill")},
			useSkill () {
				let {num} = this.actSk
				// 除复制以外, 置为已使用状态
				if (num!=7)	this.$store.commit("useSkill", {actIdx: this.actCardIdx, state: 1})
				if (this.pickCardIdx>=0) {
					this.$store.commit("actEffect", {skIdx: num, pickIdx: this.pickCardIdx, actIdx: this.actCardIdx})
					// 置底的若为免费抽取牌, 可免费抽牌数+1
					if (num===8&&this.pickCardIdx<100) {
						this.$emit("modifyDraw", 1)
					}
				}
				this.$emit("closeSkill")
			},
			pickCard (idx) {this.pickCardIdx=idx},
		},
		mounted () {
			let {num,mode} = this.actSk
			if (num <= 5) {
				uni.showLoading({
					title: this.skillMsg[num]
				})
				switch (num) {
					// 阶段-1
					case 0:
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
						this.$emit("modifyDraw", 2)
					  break
					case 5:
						break
				}
				if (num&&num<=4) {
					setTimeout(()=>{
						this.$store.commit("useSkill", {actIdx: this.actCardIdx, state: 1})
						uni.hideLoading()
						this.$emit("closeSkill")
					},1200)
				}
			}
		}
	}
</script>

<style lang="scss">
	.skill-box {
		width: 100%;
		height: 100%;
		.skill-content {
			background-color: red;
			height: 900rpx;
			width: 100%;
			padding: 20rpx;
			text {
				color: whitesmoke;
			}
			.main {
				height: 700rpx;
			}
		}
		.btn-group {
		}
	}
</style>