/* play页下部战斗区逻辑 */
export default function () {
	return {
		// 点击战斗牌,显示发动效果遮罩
		tapCbtCard: (idx, card) => {
			if (card.type !== 2) {
				if (this.actCardIdx === idx)
					this.actCardIdx = -1
				else this.actCardIdx = idx
			}
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
				switch (payload.skIdx) {
					case 10:
						swapAgain.call(this, payload)
						break
					case 11:
						sortCheckCards.call(this)
						break
				}
			}
		},
	}
}
// 技能交换*2 二阶段 再次交换
function swapAgain ({actCard, actIdx}) {
	uni.showModal({
		content: "还可以进行1次交换，是否继续？",
		cancelText: "否",
		confirmText: "是",
		success: res=>{
			if (res.confirm) {
				let ft = actIdx<100 ? this.naFts : this.spFts, k = actIdx<100? 0:1
				this.actCardIdx = ft.indexOf(actCard) + 100*k // 获得交换x2卡片在发生第1次交换后的新索引位置
				this.isSkillShow = true
				this.actSk = {num:10, mode:2}
			}
		}
	})
}
// 技能查看*3 二阶段 排序
function sortCheckCards () {
	this.isSkillShow = true
	this.actSk = {num:11, mode:2}
}
	