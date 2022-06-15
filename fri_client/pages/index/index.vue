<template>
	<view class="content flex-center" :style="{backgroundImage: `url(${imgUrl.bg})`}">
		<view class="profile flex-center">
			<!-- :style="{backgroundImage: `url(${avUrl})`}" -->
			<view v-if="avatar" class="avatar" :style="{backgroundImage: `url(${imgUrl.av+avatar}.jpg)`}">
			</view>
			<text>{{nickname}}</text>
		</view>
	  <view class="bg flex-center" >
			<image :src="imgUrl.title" mode="widthFix"></image>
			<view class="ip">
				<button class="mgb-50 start" @click="createRoom">START</button>
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
				imgUrl: {
					title: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/frt-02.png",
					bg: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/home.jpg",
					av: "https://cfunweb.oss-cn-hangzhou.aliyuncs.com/img/cfiot/av",
				}
			}
		},
		computed: {
			isLog: function () {return Boolean(this.$sta._userInfo.nickname)},
			nickname:function () {return this.$sta._userInfo.nickname},
			avatar: function () {return this.$sta._userInfo.avatar},
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
		},
		onLoad () {
			console.log("index", this.avatar)
		}
	}
</script>

<style lang="scss">
.content {
	width: 100%;
	height: 100vh;
	background: center/cover no-repeat;
	box-sizing: border-box;
	position: relative;
	.profile {
		flex-direction: column;
		width: 100rpx;
		height: 160rpx;
		position: absolute;
		top: 60rpx;
		right: 60rpx;
		.avatar {
			width: 95rpx;
			height: 95rpx;
			border-radius: 50%;
			background: center/cover no-repeat;
			background-color: white;
		}
		text {
			color: ghostwhite;
			height: 60rpx;
			font: 35rpx/60rpx $fontF;
		}
	}
	.bg {
	  width: 100%;
		height: 50%;
		flex-direction: column;
		justify-content: space-between;
		image {
			width: 480rpx;
		}
		.ip {
			width: 65%;
			height: 250rpx;
			button {
				width: 65%;
				box-shadow: 1px 1px 1px 1px rgb(50,50,50);
				color: ghostwhite;
				background-color: rgb(201, 168, 88);
				font: bold 50rpx/80rpx $fontF;
				border: 1px solid saddlebrown;
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
				font: 30rpx/65rpx $fontF;
				margin: 0;

			}
		}
	}
}
</style>
