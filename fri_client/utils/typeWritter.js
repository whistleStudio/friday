export default 	function (txt, {p=0, retain=0}={}) {
		let tim = 0
		return new Promise((rsv, rej) => {
			this.showText=txt.slice(0, p)
			tim = setInterval(()=>{
				if (p<txt.length) {
					this.showText += txt[p]
					p++
				} else {
					clearInterval(tim)
					if (retain) rsv()
					else {
						setTimeout(()=>{this.showText="";rsv()},800)
					}
				}
			},140)
		})
	}