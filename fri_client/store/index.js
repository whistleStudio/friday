import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		_userInfo: {
			nickname: "",
			avatar: 2,
			openid: ""
		}
	},
	mutations: {
		changeVal (state, {k,v}) {
			state[k] = v
		},
		changeObjVal (state, {k1,k2,v}) {
			state[k1][k2] = v
		}
	},
	actions: {
		getUserInfo (context, openid) {
			uni.request({
				url: `${Vue.prototype.$baseUrl}/login/getUserInfo`,
				data: {openid},
				success (res) {
					if (res.statusCode<400) {
						context.commit("changeObjVal", {k1:"_userInfo", k2:"nickname", v:res.data.nickname})
						context.commit("changeObjVal", {k1:"_userInfo", k2:"avatar", v:res.data.avatar})
						console.log(context.state._userInfo)
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