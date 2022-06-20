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