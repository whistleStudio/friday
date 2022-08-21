/* play页上部冒险区逻辑 */
export default function () {
	return {
		/* 冒险区长按事件（待完善） */
		advTouchStart: () => {
			let start = 0
			this.advTouch.tim = setInterval(()=>{
				start++
				if (start>20) {
					this.advTouch.isFlap = true
				}
			},100)
		},
		advTouchEnd: () => {
			clearInterval(this.advTouch.tim)
			this.advTouch.isFlap = false
		},
	}
}