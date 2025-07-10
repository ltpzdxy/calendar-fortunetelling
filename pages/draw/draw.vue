<template>
  <view class="draw-page">
    <view v-if="showResultCard" class="result-mask">
      <view class="result-card-img">
        <image class="card-bg" :src="resource.IMG_CARD_BG" mode="widthFix" />
        <view class="card-text">
			 <view v-for="(char, index) in resultText.split('')" :key="index">{{ char }}</view>
		</view>
        <view class="card-btns">
          <view class="btn-plain" @tap="showResultCard = false">返回</view>
          <view class="btn-solid" @tap="goToResult">解析</view>
        </view>
      </view>
    </view>

    <view class="tube-wrapper">
      <image
        :src="resource.IMG_TUBE_BG"
        :class="['tube-img', { shake: isShaking }]"
        mode="widthFix"
      ></image>
    </view>

    <view class="scroll-wrapper">
      <view class="scroll-window">
        <view
          class="scroll-content"
          :style="scrollStyle"
          @transitionend="onScrollEnd"
        >
          <view
            v-for="(item, index) in scrollList"
            :key="index"
            class="scroll-item"
          >
            {{ item }}
          </view>
        </view>
      </view>
    </view>
    <view class="btn-wrapper">
		<!-- 如果还没抽签，就只显示“点我抽签” -->
		  <view
		    v-if="!hasDrawn"
		    :class="['btn-draw', { disabled: isRolling }]"
		    @tap="onDraw"
		  >
		    每日一抽
		  </view>
		
		  <!-- 否则（已经抽过），只显示“今日历史签文” -->
		  <view
		    v-else
		    class="btn-history"
		    @tap="showHistory"
		  >
		    今日历史
		  </view>
		<text class="disclaimer">非占卜系统，仅供娱乐</text>
	 </view>	
  </view>
</template>

<script>
import fortuneData from "@/common/data.json";
import resource from '@/common/resource.js';
export default {
	computed: {
	    resource() {
	      return resource;
	    }
	  },
 //  onLoad() {
 //      uni.showShareMenu({
 //        withShareTicket: true,
 //        menus: ['shareAppMessage','shareTimeline']  // 打开“分享给朋友”和“分享到朋友圈”
 //      })
 //    },
	// // 分享给好友时的回调
	//   onShareAppMessage() {
	//     return {
	//       title: '祎缘万年历 · 抽签·万年历·黄历·去哪玩',
	//       path: '/pages/draw/draw',          // 用户点开后的落地页
	//       imageUrl: '/static/share-img.png'  // 你自定义的分享图
	//     }
	//   },
	
	//   // 分享到朋友圈时的回调（微信基础库 ≥ 2.7.0）
	//   onShareTimeline() {
	//     return {
	//       title: '祎缘万年历 · 抽签·万年历·黄历·去哪玩',
	//       query: ''
	//     }
	//   },
  data() {
    return {
      fullQianList: [],
      scrollList: [],
      scrollStyle: "",
      isShaking: false,
      isRolling: false,
      selectedQianId: 1,
      showResultCard: false,
      resultText: "",
	  hasDrawn: false,
	  resultTextScrollEnd: '',
	  drawHistory: []
    };
  },
  created() {
    // for (let i = 1; i <= 100; i++) {
    //   this.fullQianList.push(`第${i}签`);
    // }
	// const last = uni.getStorageSync('lastDrawDate') || '';
	// const today = new Date().toISOString().split('T')[0];
	// if (last === today) {
	//   this.hasDrawn = true;
	// }
	this.fullQianList = fortuneData.map(item => item.type);
    // 初始化时，让列表为空或只有一个占位符，避免初始显示一长串
    this.scrollList = [""];
  },
  onShow() {
      // 每次页面激活都检查一次：今天有没有抽过签
      const last = uni.getStorageSync('lastDrawDate') || ''
      const today = new Date().toISOString().split('T')[0]
      this.hasDrawn = (last === today)
	  this.drawHistory = uni.getStorageSync('drawHistory') || [];
    },
  methods: {
    shuffleArray(array) {
      let newArr = array.slice();
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    },
    randomQian() {
      const index = Math.floor(Math.random() * this.fullQianList.length);
      return {
        id: index + 1,
        text: this.fullQianList[index],
      };
    },
	showHistory() {
	  const today = new Date().toISOString().split("T")[0];
	    //console.log('drawHistory:', this.drawHistory);               // 🔍 增加日志，调试用
	    const entry = this.drawHistory.find(h => h.date === today);
	    if (!entry) {
	      uni.showToast({ title: '今日历史无记录', icon: 'none' });
	      return;
	    }
	  
	    // 🔑 强制把 entry.id 转为数字
	    const id = parseInt(entry.id, 10);
	    this.selectedQianId = id;
		//console.log('id:', id);  
	    // 🔑 只用 find，保证类型匹配；若找不到则提示错误
	    const item = fortuneData[id - 1];
	    if (!item) {
	      uni.showToast({ title: '签文不存在', icon: 'none' });
	      return;
	    }
	  
	    this.resultText = `${item.type} · ${item.text}`;
	    this.showResultCard = true;
	},
    onDraw() {
      if (this.isRolling) return;
	  if (this.hasDrawn) {
	    uni.showToast({ title: '每天只能抽签一次', icon: 'none' });
	    return;
	  }
      this.isRolling = true;
      // 重置滚动列表和样式，准备开始新动画
      this.scrollStyle = `transform: translateY(0); transition: none;`;

      // 确保重置生效后再执行动画
      this.$nextTick(() => {
        this.isShaking = true;

        setTimeout(() => {
          this.isShaking = false;
          const selected = this.randomQian();
          this.selectedQianId = selected.id;
          this.resultTextScrollEnd = selected.text;
		  this.resultText = `${fortuneData[this.selectedQianId - 1].type} · ${fortuneData[this.selectedQianId - 1].text}`;

          // 生成一个用于“滚动幻觉”的假列表
          const fakeScrollList = [];
          for (let i = 0; i < 30; i++) {
            fakeScrollList.push(this.randomQian().text);
          }
          // 将最终结果放在列表末尾
          fakeScrollList.push(selected.text);
          this.scrollList = fakeScrollList;

          const itemHeight = 80; // 对应 .scroll-item 的 height: 80rpx
          const distance = (fakeScrollList.length - 1) * itemHeight;

          // **关键改动 1: 动画曲线**
          // 使用 cubic-bezier 创建一个“快进慢出”的平滑减速效果
          // 你也可以直接用 'ease-out'
          const transitionTimingFunction = 'cubic-bezier(0.25, 1, 0.5, 1)';
          this.scrollStyle = `transform: translateY(-${distance}rpx); transition: transform 3s ${transitionTimingFunction};`;
        }, 600);
      });
    },
    onScrollEnd() {
      if (!this.isRolling) return;
	  
	  const today = new Date().toISOString().split('T')[0];
	  // 仅保留最新一条历史记录
	  const history = [{ date: today, id: this.selectedQianId }];
	  uni.setStorageSync('lastDrawDate', today);
	  this.hasDrawn = true;
	  this.drawHistory.push({ date: today, id: this.selectedQianId });
	  uni.setStorageSync('drawHistory', this.drawHistory);
	  //console.log('drawHistory id:', this.selectedQianId);  
      // **关键改动 2: 动画结束时“吸附”到最终状态**
      // 1. 将滚动列表的内容强制设为只有最终结果
      this.scrollList = [this.resultTextScrollEnd];
      
      // 2. 立即移除 transform 动画样式，让其回到原点，实现完美居中
      this.scrollStyle = `transform: translateY(0); transition: none;`;

      this.isRolling = false;
      
      // 延迟一小段时间再弹出卡片，让用户看清结果
      setTimeout(() => {
          this.showResultCard = true;
      }, 500);
    },
    goToResult() {
      uni.reLaunch({
        url: `/pages/result/result?id=${this.selectedQianId}`,
      });
    },
  },
};
</script>

<style scoped>
.draw-page {
  min-height: 100vh;
  background-color: #fdf6e3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around; 
  padding: 40rpx 0;
  box-sizing: border-box;
  position: relative;
}

.btn-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx; /* 控制按钮与文字的间距，贴近显示 */
}

.tube-wrapper {
  width: 400rpx;
  height: 400rpx;
}

.tube-img {
  width: 100%;
  height: 100%;
  transition: transform 0.3s;
}
.btn-history {
  padding: 24rpx 80rpx;
  background-color: #a05d3c;
  color: #fff;
  font-size: 38rpx;
  border-radius: 16rpx;
  font-family: "STKaiti", "KaiTi", serif;
  margin-bottom: 0; /* 添加这一行，防止按钮下有空隙 */
  box-shadow:
    0 4rpx 10rpx rgba(0, 0, 0, 0.25),
    inset 0 0 8rpx rgba(255, 255, 255, 0.2); /* 内部高光 */
}
.scroll-wrapper {
    width: 380rpx;
      height: 80rpx;
      background-color: transparent; /* 背景透明 */
      border: 2rpx solid #f5c242;     /* 柔和金边框 */
      border-radius: 20rpx;           /* 圆角 */
      box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}

.scroll-window {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.scroll-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.scroll-item {
  height: 80rpx;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;   /* 垂直居中 */
  font-family: "STKaiti", "KaiTi", serif;
  font-size: 36rpx;
  color: #a05d3c;
  font-weight: bold;
  text-shadow: 1rpx 1rpx 2rpx rgba(0,0,0,0.1);
}



.btn-draw {
  padding: 24rpx 80rpx;
  background-color: #a05d3c;
  color: #fff;
  font-size: 38rpx;
  border-radius: 16rpx;
  font-family: "STKaiti", "KaiTi", serif;
  margin-bottom: 0; /* 添加这一行，防止按钮下有空隙 */
  box-shadow:
    0 4rpx 10rpx rgba(0, 0, 0, 0.25),
    inset 0 0 8rpx rgba(255, 255, 255, 0.2); /* 内部高光 */
}

/* 其他样式与之前相同 */
.btn-draw.disabled {
  opacity: 0.6;
  /* pointer-events: none; */
}

.disclaimer {
  color: #ff0000;
    font-size: 24rpx;
    text-align: center;
    margin: 0;            /* 去除默认外边距 */
    padding-top: 8rpx;    /* 仅加一点顶间距，看起来美观 */
}

@keyframes shakeAnim {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  50% { transform: rotate(-10deg); }
  75% { transform: rotate(5deg); }
  100% { transform: rotate(0deg); }
}

.shake {
  animation: shakeAnim 0.6s ease-in-out;
}

.result-mask {
  position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3); /* 模态层背景 */
    z-index: 999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  
    /* 毛玻璃模糊核心： */
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px); /* iOS */
}

.result-card-img {
  position: relative;
  width: 500rpx; 
  height: 800rpx;
  text-align: center;
  animation: fadePop 0.4s ease-out;
}

.card-bg {
  width: 100%;
}

.card-text {
   display: flex;
     flex-direction: column;
     align-items: center;
     font-size: 48rpx;
     font-weight: bold;
     color: #a05d3c;
     font-family: "STKaiti", "KaiTi", serif;
     text-shadow: 1rpx 1rpx 4rpx #fff;
     line-height: 48rpx;
     position: absolute;
     top: 190rpx; /* 根据签文图适当调整 */
	 text-shadow: 1rpx 1rpx 2rpx rgba(255, 255, 255, 0.5);
     left: 50%;
     transform: translateX(-50%);
}

.card-btns {
  margin-top: 20rpx;
  display: flex;
  justify-content: center;
  gap: 20rpx;
}

.btn-plain,
.btn-solid {
  font-size: 32rpx;            /* 原来是28rpx */
    padding: 16rpx 40rpx;        /* 原来是10rpx 30rpx */
    border-radius: 50rpx;
    font-family: "STKaiti", "KaiTi", serif;
}

.btn-plain {
  background-color: #fff;
  border: 2rpx solid #a05d3c;
  color: #a05d3c;
}

.btn-solid {
  background-color: #a05d3c;
  color: #fff;
  border: none;
}

@keyframes fadePop {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>