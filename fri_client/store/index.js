import Vue from "vue"
import Vuex from "vuex"
import cards from "@/style/card.json"
import {shuffle, initShuffle, nextPhase, resetCard, isGameOver, validateSkill} from "./pubMethod"

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		_userInfo: {
			nickname: "temp", avatar: "00", openid: "", lvl: 1
		},
		_gameInfo: {
			glvl: 0, hp: 40, decayLvl: 0, curPhase: 2, curAdvIdx: 0, 
			curFts: {na:[], sp:[]}, curAdvs: [], disAdv: [], disFt: [], rm: [], checkCards: [], checkCardOrder: [],
			isInitOk: true, isBoss: false, isAdvsOk: false	
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
		curAdvCard ({_gameInfo,_cards}) {
			let c = _gameInfo.isBoss ? _cards.prtDeck[0] : _gameInfo.curAdvs[_gameInfo.curAdvIdx]
			return c
		},
		curPrt ({_cards}) {return _cards.prtDeck[0]}
	},
	mutations: {
		changeVal (state, {k,v}) {
			state[k] = v
		},
		changeObjVal (state, {k1,k2,v}) {
			state[k1][k2] = v
		},
		changeHp ({_gameInfo}, v) {
			_gameInfo.hp -= v
			isGameOver(_gameInfo.hp)
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
			console.log("cards shuffled!",_cards)
			setTimeout(()=>{uni.hideLoading();_gameInfo.isInitOk = true;}, 1000)	
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
						console.log("nextPhase")
						nextPhase(_gameInfo, _cards)
					}
					else pickNum = 1
					break
			}
			if (_gameInfo.isBoss) pickNum=0
			_gameInfo.curAdvs = _cards.advDeck.splice(0, pickNum)
		  _gameInfo.isAdvsOk = _gameInfo.isBoss ? false : true
		  // uni.hideLoading()
		},
		/* 弃牌 */
		discard ({_gameInfo, _cards}, {card, pile}) {
			_gameInfo[pile].unshift(card)
		},
		/* 派发1张战斗牌 */
		drawFtCard ({_gameInfo, _cards}, isFree=1) {
			let {ftDeck} = _cards
			let drawCard = ftDeck.shift()
			if (isFree) {
				_gameInfo.curFts.na.push(drawCard)
			} else _gameInfo.curFts.sp.push(drawCard)
			console.log("draw OK")
		},
		/* 添加衰老牌 */
		addWeakCard ({_gameInfo, _cards}) {
			let {weakDeck} = _cards
			let {disFt} = _gameInfo
			let weakCard
			if (weakDeck.length>0) {
				weakCard = weakDeck.shift()
				_gameInfo.decayLvl ++
			}
			_cards.ftDeck = weakCard ? [...disFt, weakCard] : [...disFt],
			_cards.ftDeck  = shuffle(_cards.ftDeck)
			_gameInfo.disFt = []
		},
		/* 战斗清算 */
		fightCheck ({_gameInfo}, {res, card}) {
			let {curFts, disFt, disAdv} = _gameInfo
			curFts.na.forEach(e => disFt.unshift(e))
			curFts.sp.forEach(e => disFt.unshift(e))
			if (res) disFt.unshift(card)
			else {
				isGameOver(_gameInfo.hp)
				disAdv.unshift(card)
			}
		},
		/* 一组卡牌移除游戏 */
		removeCard ({_gameInfo}, rmCardList) {
			let {curFts} = _gameInfo
			let decayCount = 0
			rmCardList.na.forEach(e => {
				_gameInfo.rm.unshift(e)
				let idx = curFts.na.indexOf(e)
				curFts.na.splice(idx,1)
				if(e.type===2) decayCount++
			})
			rmCardList.sp.forEach(e => {
				_gameInfo.rm.unshift(e)
				let idx = curFts.sp.indexOf(e)
				curFts.sp.splice(idx,1)
				if(e.type===2) decayCount++
			})
			console.log(decayCount)
			_gameInfo.decayLvl -= decayCount
		},
		/* 技能使用情况 */
		useSkill ({_gameInfo}, {actIdx, state}) {
			if (actIdx>=0) {
				let {na, sp} = _gameInfo.curFts
				let ft = actIdx<100 ? na : sp, idx = actIdx<100 ? actIdx : actIdx-100
				ft[idx].work = state
			}
		},
		/* 效果生效  mode-0默认/技能一阶段 | 2技能二阶段 */
		actEffect ({_gameInfo, _cards}, {skIdx, pickIdx, actIdx, mode=0}) {
			console.log("affect---", pickIdx, actIdx)
			let {na, sp} = _gameInfo.curFts
			let ft = pickIdx<100 ? na : sp, idx = pickIdx<100 ? pickIdx : pickIdx-100
			let pickCard
			console.log("actEffect")
			switch (skIdx) {
				case 5: // 加倍
					ft[idx].atk2 = ft[idx].atk*2
					break
				case 6: //摧毁
					pickCard = ft.splice(idx,1)[0]
					_gameInfo.rm.push(pickCard)
					break
				case 7: //复制
					let ft2 = actIdx<100 ? na : sp, idx2 = actIdx<100 ? actIdx : actIdx-100
					console.log(ft[idx].skill)
					ft2[idx2].skill2 = ft[idx].skill
					break
				case 8: //置底
					pickCard = ft.splice(idx,1)[0]
					pickCard.skill2 = ""
					_cards.ftDeck.push(pickCard)
					break
				case 9: //交换x1
				case 10: //交换x2
					pickCard = ft.splice(idx,1)[0]
					validateSkill.call(this, _cards.ftDeck, ()=>{
						_gameInfo.disFt.unshift(pickCard)
						this.commit("drawFtCard", 0)
					})
					break
				case 11: // 查看x3
					if (mode==0) {
						pickCard = _gameInfo.checkCards.splice(pickIdx,1)[0]
						_gameInfo.disFt.unshift(pickCard)
					} else {
						console.log("mode2")
						let {checkCards, checkCardOrder} = _gameInfo
						let tempArr1 = [], tempArr2 = []
						checkCardOrder.forEach((v,i) => {
							if (v<0) {
								tempArr1.push(checkCards[i])
							} else tempArr2[v] = checkCards[i]
						})
						_gameInfo.checkCards = [...tempArr2, ...tempArr1]
						this.commit("resetCheckCards")
					}
					break
			}
		},
		/* 查看牌组更新 */
		genCheckCards ({_gameInfo,_cards}) {
			for (let i=0; i<3; i++) {
				validateSkill.call(this, _cards.ftDeck, ()=>{
					_gameInfo.checkCards.push(_cards.ftDeck.shift()) 
				})
			}
		},
		/* 还原临时抽出的查看牌 */
		resetCheckCards ({_gameInfo, _cards}) {
			_cards.ftDeck.unshift(..._gameInfo.checkCards)
			_gameInfo.checkCards = []
			_gameInfo.checkCardOrder = []
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
		},
		ftsRunOut ({commit}) {
			console.log("runout")
			commit("addWeakCard")
			commit("drawFtCard", 0)
		}
	}
})




export default store