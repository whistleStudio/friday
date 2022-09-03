function a () {
	return new Promise((rsv, rej)=>{
		setTimeout(()=>{
			console.log("a ok")
			rsv()
		},2000)
	})
}

;(async () => {
	await a ()
	console.log("dfdfdfd")
})()