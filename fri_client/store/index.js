import Vue from "vue"
import Vuex from "vuex"
import cards from "@/style/card.json"

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		_userInfo: {
			nickname: "", avatar: "00", openid: "", lvl: 1
		},
		_gameInfo: {
			glvl: 0, hp: 20, decayLvl: 0, curPhase: 0, curAdvIdx: 0,
			curFts: {na:[], sp:[]}, curAdvs: [], disAdv: [], disFt: [], rm: [],
			isInitOk: false, isBoss: false, isAdvsOk: false	
		},
		_cards: cards
	},
	getters: {
		cbtCount ({_gameInfo}) {
			let {curFts} = _gameInfo
			if (!(curFts.na.length||curFts.sp.length)) return 0;
			let n = 0
			curFts.na.forEach(e=>{n += (e.atk2 || e.atk)})
			curFts.sp.forEach(e=>{n += (e.atk2 || e.atk)})
			return n
		},
		curAdvCard ({_gameInfo}) {return _gameInfo.curAdvs[_gameInfo.curAdvIdx]}
	},
	mutations: {
		changeVal (state, {k,v}) {
			state[k] = v
		},
		changeObjVal (state, {k1,k2,v}) {
			state[k1][k2] = v
		},
		/* 初始各牌组 */
		initDeck (state) {
			let { _gameInfo, _cards} = state
			uni.showLoading({
				title: "初始牌组..."
			})
			switch (_gameInfo.glvl) {
				case 0:
					// 普通 - 移除老年痴呆
					var rmOldCard = _cards.weakDeck.splice(3,1)
					_gameInfo.rm.push(...rmOldCard)
					initShuffle(_cards)	
					break
				case 1:
					// 残酷 - 继承上一难度，战斗牌混入1张普通老化
					_cards.weakDeck.splice(3,1)
					var rmOldCard = _cards.weakDeck.splice(3,1)
					_gameInfo.rm.push(...rmOldCard)
					var rdIdx = parseInt(Math.random()*7)
					var randWeakCard = _cards.weakDeck.splice(rdIdx,1)
					_cards.advDeck.push(...randWeakCard)
					initShuffle(_cards)
					break
				case 2:
					// 残酷 - 继承上一难度，加入老年痴呆, 战斗牌混入1张普通老化
					var rdIdx = parseInt(Math.random()*8)
					var randWeakCard = _cards.weakDeck.splice(rdIdx,1)
					_cards.advDeck.push(...randWeakCard)
					initShuffle(_cards)
					break
				case 3:
					// 梦魇 - 继承上一难度，初始HP18
					_gameInfo.hp = 18
					var rdIdx = parseInt(Math.random()*8)
					var randWeakCard = _cards.weakDeck.splice(rdIdx,1)
					_cards.advDeck.push(...randWeakCard)
					initShuffle(_cards)
					break	
			}
			console.log(_cards)
			_gameInfo.isInitOk = true
			setTimeout(()=>{uni.hideLoading()}, 1000)	
		},
		/* 派发2张冒险牌 */
		chooseAdvCard ({_gameInfo, _cards}, isNext=false) {
			_gameInfo.curAdvs = [];_gameInfo.curFts.na = [];_gameInfo.curFts.sp = [];
			_gameInfo.curAdvIdx = 0;
			let advL = _cards.advDeck.length
			let pickNum = 2
			switch (advL) {
				case 0:
				  nextPhase(_gameInfo, _cards)
					break
				case 1:
					if (isNext) {
						nextPhase(_gameInfo, _cards)
					}
					else pickNum = 1
					break
			}	
			_gameInfo.curAdvs = _cards.advDeck.splice(0, pickNum)
		  _gameInfo.isAdvsOk = true
		  // uni.hideLoading()
		},
		/* 弃牌 */
		discard ({_gameInfo, _cards}, {card, pile}) {
			_gameInfo[pile].unshift(card)
		},
		/* 派发1张战斗牌 */
		drawFtCard ({_gameInfo, _cards}) {
			let {ftDeck} = _cards
			let drawCard = ftDeck.shift()
			_gameInfo.curFts.na.push(drawCard)
		},
		/* 添加衰老牌 */
		addWeakCard ({_gameInfo, _cards}) {
			let {weakDeck} = _cards
			let {disFt} = _gameInfo
			let weakCard
			if (weakDeck.length>0) {
				weakCard = weakDeck.shift()
			}
			_cards.ftDeck = weakCard ? [...disFt, weakCard] : [...disFt],
			shuffle(_cards.ftDeck)
			_gameInfo.disFt = []
		},
		/* 战斗清算 */
		fightCheck ({_gameInfo}, {res, card}) {
			let {curFts, disFt, disAdv} = _gameInfo
			curFts.na.forEach(e => disFt.unshift(e))
			curFts.sp.forEach(e => disFt.unshift(e))
			if (res) disFt.unshift(card)
			else disAdv.unshift(card)
		},
		/* 一组卡牌移除游戏 */
		removeCard ({_gameInfo}, rmCardList) {
			let {curFts} = _gameInfo
			rmCardList.na.forEach(e => {
				_gameInfo.rm.unshift(e)
				let idx = curFts.na.indexOf(e)
				curFts.na.splice(idx,1)
			})
			rmCardList.sp.forEach(e => {
				_gameInfo.rm.unshift(e)
				let idx = curFts.sp.indexOf(e)
				curFts.sp.splice(idx,1)
			})
		}
	},
	actions: {
		getUserInfo (context, openid) {
			uni.request({
				url: `${Vue.prototype.$baseUrl}/login/getUserInfo`,
				data: {openid},
				success (res) {
					if (res.statusCode<400) {
						if (!res.data.err) {
							context.commit("changeObjVal", {k1:"_userInfo", k2:"nickname", v:res.data.nickname})
							context.commit("changeObjVal", {k1:"_userInfo", k2:"avatar", v:res.data.avatar})
							context.commit("changeObjVal", {k1:"_userInfo", k2:"lvl", v:res.data.lvl})
							console.log(context.state._userInfo)
						}
					} else uni.showToast({title:"网络出错啦",icon:"error"})
				},
				fail (err) {
					uni.showToast({title:"网络出错啦",icon:"error"})
				}
			})
		}
	},
	ftsRunOut ({commit}) {
		commit("addWeakCard")
		commit("drawFtCard")
	}
})

/* 洗牌 */
function shuffle (deck) {
	let oL = deck.length, newDeck = []
	for(let i = 0; i < oL; i++) {
		let rdIdx = parseInt(Math.random()*deck.length)
		let newCard = deck.splice(rdIdx,1)
		newDeck = [...newDeck, ...newCard]
	}
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
		this._gameInfo.isBoss = true
		uni.showToast({title:`击败这些海盗, 就能回家了`, icon:"none"})
	}
	_cards.advDeck = shuffle([..._cards.advDeck, ..._gameInfo.disAdv]) 
	_gameInfo.disAdv = []
}

export default store