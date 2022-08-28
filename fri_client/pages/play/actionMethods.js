/* play页面中间 action区域相关逻辑 */
export default function () {
	return {
		//挑战
		fight: async () => {
			// 至少抽一张牌
			if (this.drawCount) {
				await weakReduceHp.call(this)
				await weakTop0.call(this)
				await modifyPhase.call(this) 
				await modifyDoubleAtk.call(this)
				await bossHalfFt.call(this)
				await bossAtkUp.call(this)
				console.log(this.advDim)
				if (this.advDim<=0) {
					this.$store.commit("fightCheck", {res:1, card:this.curAdvCard})
					uni.showToast({title:"挑战成功!", icon:"none", duration:500})
					this.openAdvBox()
				} else {
					let curHp = this.$sta._gameInfo.hp - this.advDim
					this.$store.commit("changeHp", this.advDim)
					uni.showToast({title:`挑战失败!\n生命-${this.advDim}`, icon:"none", duration:800}) 
					setTimeout(()=>{
						this.isOverlayShow = true
						this.isAdv2Show = false
					},500)
				}
				this.drawCount = 0
				this.resetTemp()
			} else {
				uni.showToast({
					title: "手无寸铁, 至少抽一张牌",
					icon: "none",
					duration: 1000
				})
			}
		},

		// 挑战结束, 打开冒险选择窗口 
		openAdvBox: () => {
			if (this.isBoss) {
				this.$store.commit("nextBoss")
			}
			setTimeout(()=>{
				if (this.advs.length===1) {
					uni.showModal({
						content: "还剩一张冒险牌, 可放弃挑战进入下一阶段",
						cancelText: "放弃",
						confirmText: "继续",
						success: res => {
							if (res.confirm) giveAdvCard.call(this)
							else if (res.cancel) {
								giveAdvCard.call(this, true)
							}
						}
					})
				} else {
					giveAdvCard.call(this)
				}
			},500) 
		},

		//抽牌
		draw: () => {
			if (this.fts.length || this.disFt.length) {
				draw1Card.call(this)
			} else uni.showToast({title:"战斗牌库已空!", icon:"none", duration:500})
		},
		
	}
}

/* ---------------------------------------------------------------------- */

// 冒险窗口,派牌
function giveAdvCard (isNext=false) {
	this.$store.commit("chooseAdvCard", isNext)
	this.actCardIdx = -1
	if (this.isBoss) {
		this.isOverlayShow = false
	} else {
		this.isOverlayShow = true
		this.isAdv2Show = true
	}
}

// 校验战斗牌区是否存在特定技能牌
function hasSkill (skNum, decks) {
	let skillArr = []
	decks.forEach((dv, di) => {
		dv.forEach((cv, ci) => {
			if (cv.skill===skNum || cv.skill2===skNum) skillArr.push(ci+di*100)	
		})
	})
	return skillArr
}

// 战前修正： 阶段
function modifyPhase () {
	return new Promise(async (rsv, rej) => {
		let skillArr = hasSkill(0, [this.naFts, this.spFts])
		for (let v of skillArr) {
			if ((this.curPhase-this.temp.ph)>0&&!this.isBoss) {
				try {
					 if (await modalPhase.call(this)) this.temp.ph++
					 else break
				} catch(e){}
			}
		}
		rsv()
	})
}
function modalPhase () {
	return new Promise ((rsv, rej) => {
		uni.showModal({
			content: "战斗牌效果[阶段-1]是否使用?",
			confirmText: "发动",
			cancelText: "放弃",
			success: res => {
				if (res.confirm) {
					setTimeout(()=>{rsv(1)},200)
				} else if (res.cancel) {
					rsv(0)
				}
			},
			fail: (e)=>{console.log(e);rej(e)}
		})
	})
}

// 战前修正: 加倍
function modifyDoubleAtk () {
	return new Promise (async (rsv, rej)=>{
		let skillArr = hasSkill(5, [this.naFts, this.spFts])
		for (let v of skillArr) {
			if (await modalDoubleAtk.call(this)) {
				this.actCardIdx = v
				await chooseDoubleAtk.call(this)
				console.log("pick ok")
			} else break
		}
		rsv()
	})
}
function modalDoubleAtk () {
	return new Promise((rsv, rej) => {
		uni.showModal({
			content: "战斗牌效果[加倍*1]是否使用?",
			confirmText: "发动",
			cancelText: "放弃",
			success: res => {
				if (res.confirm) {
					console.log("modalPhase comfirm")
					setTimeout(()=>{rsv(1)},200)
				} else if (res.cancel) {
					console.log("modalPhase cancel")
					rsv(0)
				}
			},
			fail: (e)=>{console.log(e);rej(e)}
		})
	})
}
function chooseDoubleAtk () {
	return new Promise((rsv, rej) => {
		this.showSkill({num:5, mode:1})
		let tim = setInterval(()=>{
			if (this.actCardIdx===-1) {
				clearInterval(tim)
				rsv()
			}
		},100)
	})
}

// 虚弱牌12 13-冒险结束扣血
function weakReduceHp () {
	return new Promise ((rsv, rej) => {
		let sk1 = hasSkill(12, [this.naFts, this.spFts]), sk2 = hasSkill(13, [this.naFts, this.spFts])
		let reduction = sk1.length + sk2.length*2
		// console.log("reduction ---",reduction)
		if (reduction) {
			this.$store.commit("changeHp", reduction)
			uni.showToast({
				title: `[饥饿] 你又减少了${reduction}点生命值`,
				icon: "none",
				success () {
					setTimeout(()=>{rsv()},1500)
				}
			})
		} else rsv()
		
	})
}
// 虚弱牌14-停止（逻辑在store-drawFtCard）
// 虚弱牌15-最高=0
function weakTop0 () {
	return new Promise ((rsv, rej) => {
		let isChange = false
		let skArr = hasSkill(15, [this.naFts, this.spFts])
		for (let v of skArr) {
			let maxIdx = actTop0([this.naFts, this.spFts])
			if(maxIdx >= 0) {
				isChange = true
				this.$store.commit("actEffect", {skIdx:15, pickIdx: maxIdx, actIdx:-1})
			}
		}
		if (isChange) {
			uni.showToast({
				title: "[惊吓] 紧张的你竟丢弃了武器!",
				icon: "none",
				success () {
					setTimeout(()=>{rsv()}, 1500)
				}
			})
		} else rsv()
	})
}
function actTop0 (decks) {
	let maxAtkCard = null, maxIdx = -1, flag = 0
	decks.forEach((dv, di) => {
		dv.forEach((cv, ci) => {
			if (cv.type === 1 && !cv.atk2) {
				if (flag === 0) { 
					maxIdx = ci+di*100 //首次赋值
					maxAtkCard = cv
					flag = 1
				} else {
					if (maxAtkCard.atk<cv.atk) maxIdx = ci+di*100 //比较
				}
			}
		})
	})
	return maxIdx
}

// 海盗 52 翻开的战斗牌只算一半(必须包含老化牌)
function bossHalfFt () {
	if (this.curAdvCard?.skill==52) {
		return new Promise ((rsv, rej) => {
			this.actCardIdx = -2
			this.showSkill({num:52, mode:0})
			let tim = setInterval(()=>{
				if (this.actCardIdx===-1) {
					clearInterval(tim)
					rsv()
				}
			},100) 
		})
	}
}
// 海盗 53 翻开的战斗牌+1战斗值
function bossAtkUp () {
	if (this.curAdvCard?.skill==53) {
		return new Promise ((rsv, rej) => {
			this.$store.commit("actPrtEffect", 1)
			uni.showToast({
				title: "[海盗来袭] 愈战愈勇, 所有战斗牌+1攻击",
				icon: "none",
				success () {
					setTimeout(()=>rsv(), 2000)
				}
			})
		})
	}
}

// 抽1张牌
function draw1Card () {
	let content = "继续抽牌将消耗1生命值\n是否进行?", cost = 1
	if (this.isBoss) {
		if (this.curAdvCard.skill===51) {
			content = "[海盗来袭] 继续抽牌将消耗2生命值\n是否进行?"
			cost = 2
		}
	} 
	if (this.drawCount>=this.curDraw) {
		uni.showModal({
			content,
			success: res => {
				if (res.confirm) {
					this.$store.commit("changeHp", cost)
					drawFtCard.call(this, 0)
				}
			}
		})
	}	else {
		// this.$store.commit("drawFtCard"); 
		drawFtCard.call(this, 1)
		this.drawCount++
	}
}
//mode 0特殊1免费抽牌
function drawFtCard (mode) {
	if (this.fts.length) this.$store.commit("drawFtCard", mode)
	else {
		this.$store.dispatch("ftsRunOut", mode)
		uni.showToast({
			title: "岁月不饶人, 你似乎又衰老了些",
			icon: "none",
			duration: 1200
		})
	}
}