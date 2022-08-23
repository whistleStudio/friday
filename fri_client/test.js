function b () {console.log("im b")}
async function a () {
	;(async()=>{
		await b ()
	})()
}
a()