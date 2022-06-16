import Vue from "vue"
import Vuex from "vuex"
import {card} from "@/style/card.json"

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		_userInfo: {
			nickname: "",
			avatar: "00",
			openid: "",
			lvl: 0
		},
		_gameInfo: {
			isInitOk: false,
			glvl: 0
		}
	},
	mutations: {
		changeVal (state, {k,v}) {
			state[k] = v
		},
		changeObjVal (state, {k1,k2,v}) {
			state[k1][k2] = v
		},
		//初始牌组
		initDeck (state) {
			uni.showLoading({
				title: "初始牌组..."
			})
			switch (state._gameInfo.glvl) {
				case 0:
					break
				case 1:
					break
				case 2:
					break
				case 3:
					break
			}
			state._userInfo.isInitOk = true
			console.log("loading")
			setTimeout(()=>{uni.hideLoading()}, 1000)	
		}
	},
	actions: {
		getUserInfo (context, openid) {
			uni.request({
				url: `${Vue.prototype.$baseUrl}/login/getUserInfo`,
				data: {openid},
				success (res) {
					if (res.statusCode<400) {
						if (!res.data.err) {
							context.commit("changeObjVal", {k1:"_userInfo", k2:"nickname", v:res.data.nickname})
							context.commit("changeObjVal", {k1:"_userInfo", k2:"avatar", v:res.data.avatar})
							context.commit("changeObjVal", {k1:"_userInfo", k2:"lvl", v:res.data.lvl})
							console.log(context.state._userInfo)
						}
					} else uni.showToast({title:"网络出错啦",icon:"error"})
				},
				fail (err) {
					uni.showToast({title:"网络出错啦",icon:"error"})
				}
			})
		}
	}
})

export default store