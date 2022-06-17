let a = {
	b: [1, 2, 3]
}
let  {b} = a
b[0] = 3
console.log(a.b)