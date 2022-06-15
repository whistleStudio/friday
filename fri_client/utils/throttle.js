function _hint () {
	uni.showToast({
		title: "点击太快了，休息一会儿",
		icon: "loading"
	})
}
const throttle = {
	clickLimit (fn,{hint=_hint,limit=300}={}) {
		let valid = true
		return function () {
			if (valid) {
				valid = false
				fn.call(this,...arguments)
				setTimeout(()=>{valid=true}, limit)
			} else hint()
		}
	}
}

export default throttle