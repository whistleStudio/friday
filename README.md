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

 