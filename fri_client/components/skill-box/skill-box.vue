<template>
	<view class="skill-box">
		<view v-if="skillNum>4">
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
			skillNum: Number
		},
		methods: {
			closeSkill () {this.$emit("closeSkill")},
			useSkill () {this.$emit("useSkill")},
		},
		mounted () {
			if (this.skillNum<=4) {
				uni.showLoading({
					title: this.skillMsg[this.skillNum]
				})
				switch (skillNum) {
					case 0:
						break
					case 1:
					case 2:
						break
					case 3:
					case 4:
					  break
				}
				setTimeout(()=>{
					uni.hideLoading()
					this.useSkill()
				},1000)
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