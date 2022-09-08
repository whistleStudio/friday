<script>
	export default {
		data () {
			return {
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			// #ifndef H5		
			const accountInfo = uni.getAccountInfoSync()
			console.log(accountInfo.miniProgram.envVersion)
			if (accountInfo.miniProgram.envVersion === "release") 
				this.$store.commit("changeObjVal", {k1:"_gameInfo", k2:"isReleaseEnv", v: true})
			
  		uni.login({
			  provider: 'weixin',
				onlyAuthorize:true,
			  success: ({code}) => {
					this.$reqGet ({
						url: `${this.$baseUrl}/login/getOpenid`,
						query: {code},
						rsv: data => {
							console.log("getOpenid----", data)
							this.$store.commit("changeObjVal", {k1:"_userInfo", k2:"openid", v:data.openid})	
							this.$store.dispatch("getUserInfo", data.openid)
						}
					})
			  }
			});
			// #endif
			
			// #ifdef H5
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import url("@/style/base.scss");
	/*每个页面公共css */

</style>
