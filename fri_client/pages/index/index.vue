<template>
	<view class="content flex-center" :style="{height: wH+'px', backgroundImage: `url(${imgUrl.bg})`}">
		<view class="profile flex-center">
			<view v-if="avatar" class="avatar" :style="{backgroundImage: `url(${imgUrl.av+avatar}.jpg)`}">
			</view>
			<text>{{nickname}}</text>
		</view>
	  <view class="bg flex-center" >
			<image :src="imgUrl.title" mode="widthFix"></image>
			<view class="ip">
				<button class="mgb-50 start" @click="startGame">START</button>
			</view>
	  </view>
		<u-popup :show="isShow" @close="isShow=false" mode="top">
      <view class="popup flex-center">  
				<!-- #ifdef MP-WEIXIN -->
				<text class="mgb-50">昵称</text>
				<input v-model.trim="newnickname" type="nickname" class="weui-input mgb-50" placeholder="我是野人弗莱德, 该怎么称呼你呢？"/>
				<view class="btn-group flex-center">
					<button size="mini" @click="isShow=false">取消</button>
					<button size="mini" type="primary" @click="confirmClick">确定</button>
				</view>
				<!-- #endif -->
      </view>
		</u-popup>
		<view v-if="isShowChat" class="chat-box" @click="closeChat">
			<text>{{showText}}</text>
		</view>
	</view>
</template>

<script>
	import {mapState} from "vuex"
	import typeWritter from "@/utils/typeWritter.js"
	
	export default {
		data() {
			return {
				wH:0,
				isShow: false, isShowChat: false,
				showText: "",
				
				imgUrl: {
					title: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/frtTitle.png",
					bg: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/home.jpg",
					av: "https://cfunweb.oss-cn-hangzhou.aliyuncs.com/img/cfiot/av",
				},
				newnickname: ""
			}
		},
		computed: {
			...mapState({
				isLog: state => Boolean(state._userInfo.nickname),
				nickname: state => state._userInfo.nickname,
				avatar: state => state._userInfo.avatar,
				lastGameRes: state => state._userInfo.lastGameRes,
			}),
			chatText () {
				return {
					fail: "弗莱德： 老伙计，能看到你再次恢复斗志，可真好",
					win: `弗莱德： 新朋友你是叫${this.nickname}吗？这可真是个不错的名字 ...`
				}
			}
		},
		methods: {
			startGame () {
				this.checkIsLog()
				if (this.isLog) {
					uni.navigateTo({
						url: "/pages/level/level"
					})
				}
			},
			checkIsLog () {
				if (!this.isLog) {
					this.isShow = true
				} else {this.isShow = false}
			},
			confirmClick () {
				console.log("newnickname--",this.newnickname)
				if (this.newnickname) {
					this.$reqGet({
						url: `${this.$baseUrl}/login/setUser`,
						query: {
							nickname: this.newnickname,
							openid: this.$sta._userInfo.openid
						},
						rsv: data => {
							this.$store.commit("changeObjVal", {k1:"_userInfo", k2:"nickname", v:data.nickname})
							this.$store.commit("changeObjVal", {k1:"_userInfo", k2:"avatar", v:data.avatar})
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
			},
			/* 关闭对话框 */
			closeChat () {
				
			}
		},
		onLoad () {
			uni.getSystemInfo({
				success: info => {
					this.wH = info.windowHeight
				}
			})
			console.log("xxxxxxxx", this.lastGameRes)
			setTimeout(()=>{
				if (this.lastGameRes!=-1) {
					let text = ""
					this.isShowChat = true
					if (this.lastGameRes) text = this.chatText.win
					else text = this.chatText.fail
					;(async () => {
						await typeWritter.call(this, text, {p:4, retain:1})
						setTimeout(()=>{this.isShowChat=false},600)
					})()
				}
			},1200)
		}
	}
</script>

<style lang="scss">
.content {
	width: 100%;
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
	.chat-box {
		bottom: 50rpx;
		width: 90%;
		height: 150rpx;
		line-height: 55rpx;
		background-color: rgba(255,255,255,0.7);
		border-radius: 10rpx;
		box-sizing: border-box;
		padding: 20rpx;
		position: absolute;
		z-index: 5;
		color: $gray50;
	}
}
</style>
