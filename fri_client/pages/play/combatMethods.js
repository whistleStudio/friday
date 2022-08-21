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
		// skill-box, 技能确定使用
		useSkill: mode => {
			if (mode) {
				this.$store.commit("useSkill", {actIdx: this.actCardIdx, state: 1})
			} else this.isSkillShow = false
		},
		// 取消/确定, 关闭skill-box遮罩
		closeSkill: () => {
			this.isSkillShow = false
			this.actCardIdx = -1
		},
	}
}