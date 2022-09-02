<template>
	<view ref="end" class="end flex-col-rowcenter" :style="{backgroundImage: `url(${endInfo[gameRes].bgUrl})`}">
		<view class="main flex-col-rowcenter">
			<h1 class="title">{{endInfo[gameRes].title}}</h1>
			<view class="score flex-center">
				<text>{{score[score.length-1]}}分</text>
			</view>
			<view class="next">
				next
			</view>
		</view>
		<view class="calc topInfo flex-center" @click="topInfoClick(0)">
			<image src="../../static/end/info.png" mode="heightFix"></image> <text>计分规则</text>
		</view>
		<view class="rank topInfo flex-center" @click="topInfoClick(1)">
			<text>排行榜</text><image src="../../static/end/ranking.png" mode="heightFix"></image>
		</view>
		<u-overlay :show="ol.show" @click="ol.show=false">
			<view class="wrap flex-center">
				<!-- 排行榜 -->
				<view v-if="ol.mode" class="ol-main">
					<text class="rank-title">排行榜</text>
					<table class="rank-table">
						<tr>
							<th v-for="(v, i) in ol.rankTh" :key="i">{{v}}</th>
						</tr>
						<tr class="rank-tr" v-for="(v, i) in 10" :key="i">
							<td>
								<image v-if="i<3" :src="`../../static/end/medal${i}.png`" mode="heightFix"></image>
								<text class="rank-num" v-else>{{i+1}}</text>
							</td>
							<td>{{ol.rankList[i].nickname}}</td>
							<td>{{ol.rankList[i].score<=-999 ? "-" : ol.rankList[i].score}}</td>
						</tr>
					</table>
				</view>
				<!-- 计分规则 -->
				<view v-else class="ol-main">
					<text class="calc-title">计分规则</text>
					<table class="calc-table">
						<tr>
							<th v-for="(v,i) in ol.calcTb" :key="i" align="left">{{v[0]}}</th>
						</tr>
						<tr class="calc-tr" v-for="(v,i) in ol.calcTb[0].length-1" :key="i">
							<td v-for="(cv, ci) in ol.calcTb" :key="ci">{{cv[i+1]}}</td>
						</tr>
					</table>
				</view>
			</view>
		</u-overlay>
	</view>
</template>

<script>
	import {mapState} from "vuex"
	
	export default {
		data() {
			return {
				gameRes: 1,
				wH: 0,
				ol: {
					show: false,
					mode: 0,
					calcTb: [
						["项目", "战斗卡(含弃牌堆)", "挑战者牌组衰老卡(含弃牌堆)", "击败的海盗", "剩余生命值", "未通过的冒险卡", "挑战难度", ],
						["分值", "[战斗值]分/张", "-3分/张", "15分/张", "5分/点生命值", "-1分/张", "普通x1.0|困难x1.2|灾难x1.5|梦魇x2.0"]
					],
					rankTh: ["排名", "用户名", "分数"],
					rankList: Array(10).fill({nickname: "-", score: "-"})
				},
				endInfo:[
					{
						title: "You Lose",
						bgUrl: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/defeat.png"
					},
					{
						title: "You Win",
						bgUrl: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/img/victory.jpg"
					}
				] 
			}
		},
		computed: {
			...mapState({
				score: state => state._gameInfo.score,
				openid: state => state._userInfo.openid,
				nickname: state => state._userInfo.nickname
			})
		},
		methods: {
			topInfoClick (mode) {
				this.ol.show = true
				this.ol.mode = mode
			}
		},
		onLoad (p) {
			console.log(typeof p.res, p.res)
			uni.getSystemInfo({
				success: info => {
					this.wH = info.windowHeight
				}
			})
			if (p.res==1) {
				this.gameRes = p.res
			}
			if (typeof this.score[this.score.length-1] !== "number") {
				uni.showToast({
					title: "糟糕, 计分出错了",
					icon: "none",
					duration: 800
				})
			} else {
				/* 请求排行榜列表 */
				this.$reqGet({
					url: `${this.$baseUrl}/data/setNewScore`,
					query: {
						openid: this.openid,
						nickname: this.nickname,
						score: this.score[this.score.length-1]
					},
					rsv: data => {
						if (!data.err) {
							console.log(data.rankList)
							this.ol.rankList = data.rankList
						} else {console.log("setNewScore err:", data.err);uni.showToast({title:data.msg, icon:"error", duration:800})}
					}
				})
			}
		},
		onReady () {
			this.$refs.end.$el.style.height = this.wH + "px"
		}
 	}
</script>

<style lang="scss" src="./end.scss"></style>
