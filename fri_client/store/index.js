import Vue from "vue"
import Vuex from "vuex"
import cards from "@/style/card.json"

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		_userInfo: {
			nickname: "",
			avatar: "00",
			openid: "",
			lvl: 1
		},
		_gameInfo: {
			isInitOk: false,
			glvl: 0,
			hp: 20,
			decayLvl: 0,
			curFts: {na:[], sp:[]},
			curAdvs: [],
			disAdv: [],
			disFt: [],
			rm: [],
			isNextPhase: false,
			isAdvsOk: false
		},
		_cards: cards
	},
	getters: {
		cbtCount ({_gameInfo}) {
			let n = 0
			let {curFts} = _gameInfo
			curFts.na.forEach(e=>{n += (e.atk2 || e.atk)})
			curFts.sp.forEach(e=>{n += (e.atk2 || e.atk)})
			return n
		}
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
			// setTimeout(()=>{uni.hideLoading()}, 1000)	
		},
		/* 派发2张冒险牌 */
		chooseAdvCard ({_gameInfo, _cards}) {
			// let {curAdvs} = _gameInfo
			let {advDeck} = _cards
			let advL = advDeck.length
			if (advL) {
				if (advL !== 1) {
					var pickCards = advDeck.splice(0,2)
					_gameInfo.curAdvs = [...pickCards]
				} else {
					_gameInfo.curAdvs = [...advDeck]
				}
			} else _gameInfo.isNextPhase = true
			_gameInfo.isAdvsOk = true
			uni.hideLoading()
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

export default store