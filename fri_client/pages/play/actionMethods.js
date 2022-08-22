/* play页面中间 action区域相关逻辑 */
export default function () {
	return {
		//挑战
		fight: () => {
			if (this.advDim<=0) {
				this.$store.commit("fightCheck", {res:1, card:this.curAdvCard})
				uni.showToast({title:"挑战成功!", icon:"none", duration:500})
				this.openAdvBox()
			} else {
				let curHp = this.$sta._gameInfo.hp - this.advDim
				this.$store.commit("changeHp", this.advDim)
				uni.showToast({title:`挑战失败!\n生命-${this.advDim}`, icon:"none", duration:500}) 
				setTimeout(()=>{
					this.isOverlayShow = true
					this.isAdv2Show = false
				},500)
			}
			this.drawCount = 0
			this.resetTemp()
		},
		// 挑战结束, 打开冒险选择窗口 
		openAdvBox: () => {
			setTimeout(()=>{
				if (this.advs.length===1) {
					uni.showModal({
						content: "还剩一张冒险牌, 可放弃挑战进入下一阶段",
						cancelText: "放弃",
						confirmText: "继续",
						success: res => {
							if (res.confirm) this.giveAdvCard()
							else if (res.cancel) {
								this.$store.commit("changeObjVal", {k1:"_gameInfo", k2:"isNextPhase", v:true})
								this.giveAdvCard()
							}
						}
					})
				} else {
					console.log("oAB---", this)
					this.giveAdvCard()
				}
			},500) 
		},
		// 冒险窗口,派牌
		giveAdvCard: () => {
			console.log("gAC", this)
			this.$store.commit("chooseAdvCard")
			this.isOverlayShow = true
			this.isAdv2Show = true
		},
		//抽牌
		draw: () => {
			if (this.fts.length || this.disFt.length) {
				this.draw1Card()
			} else uni.showToast({title:"牌库已空!", icon:"none"})
		},
		draw1Card: () => {
			if (this.drawCount>=this.curDraw) {
				uni.showModal({
					content: "继续抽牌将消耗1生命值\n是否进行?",
					success: res => {
						if (res.confirm) {
							this.$store.commit("changeHp", 1)
							if (this.fts.length) this.$store.commit("drawFtCard", 0)
							else {
								this.$store.dispatch("ftsRunOut")
								uni.showLoading({title: "岁月不饶人, 你似乎又衰老了些"})
								setTimeout(()=>{uni.hideLoading()},1500)
							}
						}
					}
				})
			}	else {this.$store.commit("drawFtCard"); this.drawCount++}
		},

	}
}