<template>
	<view class="content flex-center">
	  <view class="bg flex-center">
			<view class="ip">
				<button class="mgb-50" @click="createRoom">创建房间</button>
				<button>加入房间</button>
			</view>
	  </view>
		<u-popup :show="isShow" @close="isShow=false" mode="top">
      <view class="popup flex-center">  
				<!-- #ifdef MP-WEIXIN -->
				<text class="mgb-50">昵称</text>
				<input v-model.trim="nickname" type="nickname" class="weui-input mgb-50" placeholder="取个名字吧"/>
				<view class="btn-group flex-center">
					<button size="mini" @click="isShow=false">取消</button>
					<button size="mini" type="primary" @click="confirmClick">确定</button>
				</view>
				<!-- #endif -->
      </view>
		</u-popup>
	</view>
</template>

<script>
  import io from '@hyoga/uni-socket.io';
	
	export default {
		data() {
			return {
				isShow: false,
				nickname: ""
			}
		},
		computed: {
			isLog: function () {return Boolean(this.$sta._userInfo.nickname)}
		},
		onLoad() {
			// console.log(this.$sta._userInfo.avatar)
		},
		methods: {
			createRoom () {
				this.checkIsLog()
			},
			checkIsLog () {
				if (!this.isLog) {
					this.isShow = true
				} else {this.isShow = false}
			},
			confirmClick () {
				if (this.nickname) {
					this.$reqGet({
						url: `${this.$baseUrl}/login/setUser`,
						query: {
							nickname: this.nickname,
							openid: this.$sta._userInfo.openid
						},
						rsv: data => {
							console.log(data)
							if (!data.err) {}
							else uni.showToast({title: data.msg, icon:"error"})
							this.isShow = false
						}
					})
				} else {
					uni.showToast({
						title: "昵称不能为空",
						icon: "error"
					})
				}

			}
		}
	}
</script>

<style lang="scss">
.content {
	width: 100%;
	height: 100vh;
	box-sizing: border-box;
	.bg {
	  width: 100%;
		height: 95%;
		background: url("https://s1.ax1x.com/2022/06/13/XRBITU.jpg") center/cover no-repeat;
		.ip {
			width: 65%;
			height: 250rpx;
			button {
				width: 65%;
				box-shadow: 1px 1px 1px 1px gray;
			}				
		}
	}
	.popup {
		flex-direction: column;
		width: 100%;
		height: 350rpx;
		input {
			border: 1px solid $gray210;
			border-radius: 10rpx;
			box-sizing: border-box;
		  padding-left: 10rpx;
			width: 80%;
			height: 80rpx;
			font: 30rpx/80rpx $fontF;
		}
		.btn-group {
			width: 80%;
			justify-content: space-between;
      button {
				width: 250rpx;
				margin: 0;
			}
		}
	}
}
</style>
