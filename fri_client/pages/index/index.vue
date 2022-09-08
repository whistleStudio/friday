<template>
	<view v-if="isReleaseEnv" class="content flex-center" :style="{height: wH+'px', backgroundImage: `url(${imgUrl.bg})`}">
		<view class="profile flex-center">
			<view v-if="avatar" class="avatar" :style="{backgroundImage: `url(${imgUrl.av+avatar}.jpg)`}">
			</view>
			<text>{{nickname}}</text>
		</view>
	  <view class="bg flex-center" >
			<image :src="imgUrl.title" mode="widthFix"></image>
			<view class="ip flex-col-rowcenter">
				<button @click="isShowDiary=true">弗莱德日记</button>
				<button class="start" @click="startGame">逃离荒岛</button>
<!-- 				<text @click="viewRule">弗莱德生存法则</text>
				<text @click="">挑战者排名</text> -->
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
		<u-overlay :show="isShowDiary">
			<view class="diary-box flex-center">
				<view class="paper" :style="{backgroundImage: `url(${imgUrl.paper})`}">
					<view class="rule">
						<image class="food" src="../../static/index/food.png" mode="heightFix"></image>
						<text @click="viewRule">荒岛生存指南</text>
					</view>
					<text class="dt-1">下 次 轮 到 谁 呢</text>
					<text class="dt-2">{{today}}</text>
					<ul class="diary-rank">
						<li class="dRank-head">
							<view v-for="(v, i) in 3" :key="i" >
								<image :src="`../../static/index/rankL${i}.png`" mode="heightFix"></image>
							</view>
						</li>
						<li class="dRank-li" v-for="(v, i) in 10" :key="i">
							<view>{{i+1}}</view>
							<view>{{rankList[i].nickname}}</view>
							<view>{{rankList[i].score<=-999 ? "-" : rankList[i].score}}</view>
						</li>
					</ul>
					<view class="close-paper" @click="isShowDiary=false">x</view>
				</view>
			</view>
		</u-overlay>
		<view v-if="isShowChat" class="chat-box">
			<text>{{showText}}</text>
		</view>
	</view>
	<view v-else class="magic flex-center" :style="{height: wH+'px'}">
		<aamagic />
	</view>
</template>

<script>
	import {mapState} from "vuex"
	import typeWritter from "@/utils/typeWritter.js"
	
	export default {
		data() {
			return {
				wH:0,
				isShow: false, isShowChat: false, isShowDiary: false,
				showText: "",
				rankList: Array(10).fill({nickname: "-", score: "-"}),
				ruleUrl: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/doc/FridayRulesSCh.pdf",
				imgUrl: {
					title: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/frtTitle.png",
					bg: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/home.jpg",
					av: "https://cfunweb.oss-cn-hangzhou.aliyuncs.com/img/cfiot/av",
					paper: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/oldpaper.png",
					
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
				isReleaseEnv: state => state._gameInfo.isReleaseEnv
			}),
			chatText () {
				return {
					fail: "弗莱德： 老伙计，能看到你再次恢复斗志，可真好",
					win: `弗莱德： 新朋友你是叫${this.nickname}吗？这可真是个不错的名字 ...`
				}
			},
			today () {
				let t = new Date()
				return `${t.getFullYear()} - ${t.getMonth()+1} - ${t.getDate()}`
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
			/* 规则查看 */
			viewRule () {
				uni.downloadFile({
				  url: this.ruleUrl,
				  success: function (res) {
				    var filePath = res.tempFilePath;
				    uni.openDocument({
				      filePath: filePath,
				      showMenu: true,
				      success: function (res) {
				        console.log('打开文档成功');
				      }
				    });
				  }
				});
			},
			/* 请求排行榜列表 */
			getRankList () {
				this.$reqGet({
					url: `${this.$baseUrl}/data/getRankList`,
					rsv: data =>{
						if (!data.err) {
							console.log("getRL", data.rankList)
							this.rankList = data.rankList
						} else {console.log("getRL err");uni.showToast({title:data.msg, icon:"error", duration:500})}
					}
				})
			}
		},
		onLoad () {
			uni.getSystemInfo({
				success: info => {
					this.wH = info.windowHeight
				}
			})
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
			this.getRankList()
		}
	}
</script>

<style src="./index.scss" lang="scss"></style>
