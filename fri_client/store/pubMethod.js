/* 洗牌 */
function shuffle (deck) {
	resetCard(deck) 
	let oL = deck.length, newDeck = []
	for(let i = 0; i < oL; i++) {
		let rdIdx = parseInt(Math.random()*deck.length)
		let newCard = deck.splice(rdIdx,1)
		newDeck = [...newDeck, ...newCard]
	}
	console.log("shuffle ok")
	return newDeck
}

/* 初始洗牌 */
function initShuffle (_cards) {
	let {advDeck,ftDeck,weakDeck,prtDeck} = _cards
	_cards.advDeck = shuffle(advDeck)
	_cards.ftDeck = shuffle(ftDeck)
	_cards.prtDeck = shuffle(prtDeck).splice(0,2)
	let supWeakDeck = weakDeck.splice(-3)
	weakDeck = shuffle(weakDeck)
	supWeakDeck = shuffle(supWeakDeck)
	_cards.weakDeck = [...weakDeck, ...supWeakDeck]
}

/* 提示进入阶段x */
function nextPhase (_gameInfo,_cards) {
	if (_gameInfo.curPhase < 2) {
		_gameInfo.curPhase++
		uni.showToast({title:`形势又严峻了些...`, icon:"none"})
	} else {
		_gameInfo.isBoss = true
		uni.showToast({title:`击败这些海盗, 就能回家了`, icon:"none"})
	}
	_cards.advDeck = shuffle([..._cards.advDeck, ..._gameInfo.disAdv]) 
	_gameInfo.disAdv = []
}

/* 重置卡牌  1-牌组;0-单张*/
function resetCard(card,mode=1) {
	if (mode) {
		card.forEach(e=>{
			if(e.atk2+"") e.atk2=""
			if(e.skill2+"") e.skill2=""
		})
	} else {
		if(card.atk2+"") card.atk2=""
		if(card.skill2+"") card.skill2=""
	}
}

/* 校验战斗牌库是否抽空，技能是否能正常使用 */
function validateSkill (ftDeck, fn=()=>{}) {
	// ************bug所有牌都抽了，弃牌堆也没有******************
	if (ftDeck.length>0) fn()
	else {
		this.commit("addWeakCard")
		fn()
	}
}


/* 判断游戏结束 */
function isGameOver (hp) {
	if (hp<0) {
		uni.navigateTo({
			url: "/pages/end/end"
		})
	}
}

export {shuffle, initShuffle, nextPhase, resetCard, isGameOver, validateSkill}