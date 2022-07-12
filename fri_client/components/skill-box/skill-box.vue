<template>
	<view class="skill-box flex-center">
		<view v-if="actSk.num>5 || (actSk.num==5&&actSk.mode)" class="skill-content flex-col-rowcenter">
			<text>{{skillMsg[actSk.num]}}</text>
			<view class="main">
				<skill-card-list :actCardIdx="actCardIdx" :actSk="actSk"></skill-card-list>
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
				skillMsg
			};
		},
		props: {
			actSk: Object,
			actCardIdx: Number,
		},
		methods: {
			closeSkill () {this.$emit("closeSkill")},
			useSkill (mode=0) {this.$emit("useSkill",mode)},
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
				if (num&&num<=4) mode=1 
				setTimeout(()=>{
					uni.hideLoading()
					this.useSkill(mode)
				},1500)
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