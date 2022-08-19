let a = {a:1}

{
	function b () {
		// let c = {a:99}
		let a = 99
		console.log(this)
		return {
			d: ()=>{console.log(this.a)}
		}
	}
	// let d = b.call(a)

}
	// let d = b.call(a)
	let d =b()
	console.log(d)
	d.d()