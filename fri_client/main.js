import App from './App'
import store from "./store"
import uView from 'uview-ui';
Vue.use(uView);
uni.$u.config.unit = 'rpx'

// #ifdef H5
var baseUrl = '/api'
// #endif

// #ifndef H5
var baseUrl = "http://localhost:3000" 
// #endif
Vue.prototype.$baseUrl = baseUrl
Vue.prototype.$sta = store.state

Vue.prototype.$reqPost = function ({url,body,rsv=()=>{},rej=()=>{}}) {
  uni.request({
  	url,
  	method: "POST",
  	header:  {
  		'Content-Type': 'application/json;charset=utf-8',
			// "authorization": store.state.token || ""
  	},
  	data: body,
  	success (res) {
			if (res.statusCode<400) {
				rsv(res.data)
			} else uni.showToast({title:"网络出错啦",icon:"error"})
  	},
  	fail (err) {
			uni.showToast({title:"网络出错啦",icon:"error"})
			rej(err)
  	}
	})
}
Vue.prototype.$reqGet = function ({url,query,rsv=()=>{},rej=()=>{}}) {
  uni.request({
  	url,
  	header:  {
  		'Content-Type': 'application/json;charset=utf-8',
			// "authorization": store.state.token || ""
  	},
  	data: query,
  	success (res) {
			if (res.statusCode<400) {
				rsv(res.data)
			} else uni.showToast({title:"网络出错啦",icon:"error"})
  	},
  	fail (err) {
			uni.showToast({title:"网络出错啦",icon:"error"})
			rej(err)
  	}
	})
}

import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
		store
})
app.$mount()


