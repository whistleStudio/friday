## DEV LOG

### [06151735] 

- client

1 修改登录页样式

2 增加profile 元素

【待】增加编辑头像用户名功能

- server

1 新建friday数据库

- design

AI里做了一部分布局

### [06161734]

-  client

1 修改app.vue初始请求逻辑， 修复nickname问题

2 新增level页面

3 新增play页面 完成部分样式

4 状态机新增_gameInfo; _userInfo新增lvl字段

5 增加card.json, 主要业务逻辑依赖

- server 

1 修复setUser接口

2 数据库User model新增lvl, score字段

- design

AI里基本完成play页面布局

### [06162300]

- client 

1 微信小程序nickname input PC上测试，拿不到value; 手机上好像可以

2 play页面 用uview遮罩层组件和uniapp 的 swiper组件做，冒险牌选择实现

### [06172221]

- client 

1 修复遮罩层小程序不居中问题

2 状态机添加初始洗牌，洗牌，弃牌等方法

3 card.json 细分为不同牌组

4 play页初始冒险牌2选1调通

### [06201730]

- client

1 play-adventure相应样式

2 play 增加action组，用做抽牌,挑战

3 修复swiper的current同步问题，前面傻了当作双向绑定, `:current = idx` ,只是idx->current, 双向还需加上change事件调用ev.detail

### [06211734]

- client

1 play页面战斗区布局

2 封装战斗卡牌组件cbt-card

3 store增加抽取的战斗卡字段

4 play页抽牌对应方法

### [06221733]

- client 

1 抽离choose-adv overlay

2 rm-box overlay 组件绘制

3 状态机 战斗清算 移除游戏 方法

4 【待解决✔】移除方法，新添到disAdv的卡牌为undefined 

5 还要再抽离，状态机有些乱 

### [06231730]

- client

1 抽离 adv-card

2 费血抽牌

3 优化派发冒险牌，考虑adv 0 disAdv 0情况，阶段升级

4 修复 无战斗牌默认攻击0

### [06241746]

- client

1 popup

2 海盗布局

3 【待解决✔（解决办法就是在computed里再加个判断，没拿到数据给个其他值，暂时还是不知道为啥小程序不行）】微信小程序 curAdvCard 加载速度跟不上读取 

### [06271736]

- client

1 popup dis-box完成

2 状态机添加游戏结束跳转，抽离一些公共方法

3 修复其中一部分抽牌bug

4 【待解决】fts抽空后，抽牌atk2 undefined

### [06281728]

- client 

card.json录入中

### [06281730]

- client

卡牌数据均录入card.json(修改了部分字段), 对象存储存入图片

### [07011732]

- client

1 修复curDraw

2 修复popup无法滚动问题

3 修复战斗牌抽空，洗牌BUG

4 decayLvl变化

### [07041732]

- client 

1 修正免费抽牌机制

2 play战斗区代码优化, naFt, spFt的template改对象迭代

3 卡牌效果触发联动

3.1 确保play战斗区发动效果时，只存在一张卡牌处于激活状态，

actCardIdx === cardIdx, 索引用idx和100+idx区分na与sp保证唯一性

3.2 能发动效果的卡牌 skill字段!=99 && 索引匹配 && 未发动过效果

3.3 cbt-card点击发动效果，play中skill遮罩激活

3.4 skill遮罩

3.4.1 取消- 关闭,actCardIdx置-1（以隐藏发动效果按钮样式）

3.4.2 确定 - $emit "useSkill" -> [play]isSkillUsed=true -> [cbt-card]watch props isSkillUsed, 索引匹配时, $emit "resetSkillUsed" -> [play] 关闭遮罩，actCardIdx置-1, isSkillUsed=false

4 重新整理了card.json的skill编号，以方便后续调用

### [07061732]

- client

1 重排card.json的skill序号

2 整理了skillbox逻辑，用skill和mode区分

skill>5|| (!mode&&skill==5) 显示具体技能操作布局

skill<=5 && !mode [需要修改]

3 hp+1+2 draw+1+2

 ### [08191108]

- client - 改了下mapState, 考虑用function call 封装script里的逻辑

### [08202113]

- client 

1 置底逻辑

2  优化play的methods, 抽离不同区域

3 play 页 resetUsedSkill与closeSkill , 调整仅保留closeSkill

4 play页 useSkill无用, 现直接让skill-box触发useSkill -> commit store改变技能使用状态, 之前useSkill参数mode取消, 调用后emit closeSkill 关闭skill-box遮罩重置actCardIdx

5 store - actEffect方法 置底,交换x1逻辑

### [08212036]

- client

1 closeSkill 增加参数payload, 用于关闭遮罩后再触发某些事件;现用于交换x2技能, 第二次使用时,再次打开skill-box 

交换x2逻辑: 第一次交换时,记录下actCard -> 带参emit closeSkill -> 关闭遮罩后, 显示是否用第二次模态框 -> 是触发swapAgain -> 检索actCard在第一次使用交换后在ft里的新位置, 改变actCardIdx, 改变actSk.mode =2 , 打开skillbox -> 进行选择,mode==2作为第二次交换标记

[注意: u-overlay :show属性false时, 应该相当于v-if,整个组件都会没有,所以在消失后再emit事件,父级是没有办法接收到的]

2 play页用...arguments形式代替之前的形参

### [08221736]

- client

1 避免v-if v-eles 在v-for中重复渲染，用两个并列的v-if

2 closeSkill   根据是否存在 payload 区分是否具有多阶段， 然后根据payload里的skIdx再细分

3 store actEffect方法 新增参数 mode=0, 用于区分部分技能的一二阶段

4  skill-card-list根据actSK渲染不同dom 技能11 查看*3 一阶段逻辑完成， 二阶段skill-card-list 待调整

### [08222212]

- client

1 技能查看*3 两次确定使用逻辑基本OK, 还差取消逻辑; store 增加了checkCards和checkCardOrder

2 skillMsg.json 增加subMsg字段 用于显示阶段提醒信息 

3 [待解决]skill-box 的 useSkill 方法， 条件分支有些乱

### [08231727]

- client

1 技能查看*3 取消逻辑OK

2 【待解决BUG】冒险牌组全打空，弃牌堆也没有

3 play页data temp增加ph字段 用于管理阶段变化

4 【待解决】play抽离的methods模块还可以简化，用fn.call(this)

5 【待解决】过滤虚弱牌，弃牌还原

6 技能加倍*1 逻辑完成

7 开始写虚弱牌逻辑啦，comeon

### [08232209]

- client 

1 虚弱 -1-2HP 停止 逻辑完成; store 增加isStopDraw, play页监听变化

### [08241738]

- client 

（md 某人上班哼歌真尼玛吵）

1 虚弱 战斗最高0 

2 海盗牌 50 51 52（正在写）

3 adv-card 原computed大多数改为用props, 由play传递；攻击力增加红色削弱样式

4 store - state增加prtHarm, 在抽Boss牌时，触发计算

5 weakDeck增加atk2字段默认"",方便正常显示；

6 atk的显示原本未考虑到atk2==0时， atk2||atk， atk2仍然无效情况； 已改为判断`Boolean(atk2+"")`

### [08242310]

- client

1 海盗 52 现用store记录选择的战斗牌

### [08251727]

- client 

1 海盗 52 OK 

2 store setPrtHarm 改为 actPrtEffect, 感觉参数mode 判定行为0定伤 1战斗修正

### [08261728]

- client

1 海盗 53 54

2 adv-card 海盗icon

3 store fightCheck isGameOver  修正

4 play advDim 修正 海盗harm

5 修复 至少抽一张牌才能发起挑战

### [08271312]

- client

1 小程序 image src 动态拼接可能会出现 页面已经渲染但路径中变量还未获取报错现象，虽然后期还是能够重新渲染出来，但控制台还是会报一次红；解决办法：对于问题变量加个v-if 判断下有没有获取到

2 小程序不支持v-for 遍历对象的第三个参数；解决办法： 用Object.values() 或 Object.keys()遍历数组

3 【修复】skill-card-list卡牌阵列因v-show名存实亡导致的排列不整齐问题，删除v-show，cbt-card增加disabled蒙版及props(默认不显示), skill-card-list激活卡牌显示disabled且点击事件无效

4 【修复】play 小程序数据刷新速度较慢，首次获取undefined 用||、？给默认值规避

```javascript
//curAdvCard之前会首次加载undefined
curDraw () {return this.isBoss ? this.curAdvCard.draw+this.temp.draw : (this.curAdvCard?.ch2||0)+1+this.temp.draw}
```

### [08281300]

- client

1 【修复】卡牌atk为负数时，skill-card-list无法选中

2 【调整】蒙版中box不居中，u-overlay子节点用一个容器view，再包装业务逻辑的盒子

3 【修复】战斗牌库抽空无法再抽，actionMethods 抽离drawFtCard方法用于判断战斗牌库是否为空

4 【调整】蒙版box增加v-show判断，在点击发动技能后，第一时间消失，避免因数据变化，页面产生渲染造成的错误信息停留

5 【修复】抽牌后，actCardIdx置-1，避免未发动技能但选中后，进行调整，新一轮的样式继承

6 【修复】小程序 u-overlay属性show背后机制应该是v-show,   所以会导致组件加载后部分生命周期函数无效,   遮罩里子节点容器用v-if控制（H5不存在，其show属性对应是v-if）

7 【待解决】 drawCount 为0时手无寸铁提示 和交换有些冲突

### [08291645]

- client

1 【调整】dis-box 样式列对齐

2 【修复】sill-card-list 部分技能样式错乱

3 【修复】查看*3 技能一阶段执行完 二阶段无效，isSillShow变化太快，DOM还没来及变化，数据就已经实现了从true->false->true，因而不会重新渲染，解决用nextTick确保在上次渲染结束后再赋新值

4 【调整】 skillbox mounted 应是showToast

5 【修复】card.work 洗牌后还原0

### [08301727]

- client 

1 `this.$refs.end.$el.style.height`  要配合$el获取样式

2 【待解决】图片统一为像素风

3 end页样式布局基本OK

