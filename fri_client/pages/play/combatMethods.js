/* play页下部战斗区逻辑 */
export default function () {
	return {
		// 点击战斗牌,显示发动效果遮罩
		tapCbtCard: idx => {
			if (this.actCardIdx === idx)
				this.actCardIdx = -1
			else this.actCardIdx = idx
			console.log("tap",this.actCardIdx, idx)
		},
		// 点击发动效果, skill-box遮罩显示
		showSkill: actSk => {
			this.isSkillShow = true
			this.actSk = actSk
		},
		// 取消/确定, 关闭skill-box遮罩
		closeSkill: payload => {
			this.isSkillShow = false
			this.actCardIdx = -1
			// 交换x2 第2次使用时触发
			if (payload) {
				uni.showModal({
					content: "还可以进行1次交换，是否继续？",
					cancelText: "否",
					confirmText: "是",
					success: res=>{
						if (res.confirm) {
							this.swapAgain(payload)
						}
					}
				})
			}
		},
		// 技能交换x2第二次交换
		swapAgain: ({actCard, actIdx}) => {
			let ft = actIdx<100 ? this.naFts : this.spFts, k = actIdx<100? 0:1
			this.actCardIdx = ft.indexOf(actCard) + 100*k // 获得交换x2卡片在发生第1次交换后的新索引位置
			this.isSkillShow = true
			this.actSk = {num:10, mode:2}
		}
	}
}