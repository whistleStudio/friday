<template>
	<view class="skill-box">
		<view v-if="actSk.num>5 || (actSk.num==5&&actSk.mode)">
			<text></text>
			<view class="main">
				
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
			actSk: Object
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
		.btn-group {
		}
	}
</style>