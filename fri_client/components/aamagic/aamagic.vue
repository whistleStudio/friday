<!-- draw -->
<template>
  <view class="draw">
    <view class="content">
			<text class="h3">弗莱德抽签模拟器</text>
      <view class="cartoon"></view>
      <view class="main">
        <ul class="main-ul">
          <li class="main-li" v-for="(v,i) in pos" :key="i">
            <view class="icon"></view>
            <view class="text">
              <span>{{v.text[v.idx]}}</span>
            </view>
          </li>
          <li class="main-li">
            <view class="icon-store"></view>
            <view class="detail">
              <view v-for="(v,i) in store" :key="i">
                <span>{{v.text}}</span>
                <ul class="main-ul">
                  <li class="main-li" v-for="(cv,ci) in v.idx" :key="ci">
                    <view class="food-img" :style="{backgroundImage: `url(${foodUrl}/food${cv}.png)`}"></view>
                    <span>{{food[cv]}}</span>
                  </li>
                </ul>
              </view>
            </view>
          </li>
        </ul>
      </view>
      <button class="mbtn" @click="start">{{isStart ? "开始" : "暂停"}}</button>
    </view>
  </view>
</template>

<script>
  export default {
    data () {
      return {
        tim: 0,
				foodUrl: "https://wxgame-1300400818.cos.ap-nanjing.myqcloud.com/friday/magic",
        pos: [
          {text:["货舱A","货舱B", "货舱C"], idx:0},
          {text:["1","2","3","4","5","6"], idx:0},
          {text:["农庄", "学校", "医院", "公园"], idx:0}
        ],
        store: [
          {text: "高价", idx: [0, 1]},
          {text: "低价", idx: [2, 3]}
        ],
        food: ["苹果", "梨子", "桃子", "香蕉"],
        isStart: true, isClick: false,
      };
    },
    methods: {
      shufflePos () {
        this.pos.forEach(e => {
          e.idx = parseInt(Math.random()*e.text.length)
        })
      },
      shuffleFood () {
        let arr = [0, 1, 2, 3]
        for (let i = 0; i<4; i++) {
          let rdIdx = parseInt(Math.random()*arr.length)
          if (i<2) this.$set(this.store[0].idx, i, arr.splice(rdIdx, 1)[0]) 
          else this.$set(this.store[1].idx, i-2, arr.splice(rdIdx, 1)[0])  
        }
      },
      start () {
        let inv = 50
        if (this.isStart) {
          this.tim = setInterval(() => {
            this.shufflePos()
            this.shuffleFood()
          }, inv)
        } else clearInterval(this.tim)
        this.isStart = !this.isStart
      },
    }
  }
</script>

<style src="./aamagic.scss" lang="scss" scoped></style>