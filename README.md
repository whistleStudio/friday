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