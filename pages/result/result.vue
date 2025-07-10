<template>
  <view class="result-page">
	<image
		:src="resultImageUrl"
		mode="aspectFill"
		class="bg-image"
		style="width:100%;height:100%;"
	  />
    <view class="foreground-content">
      <view class="content-area">
        <scroll-view scroll-y="true" class="scrollable-content">
          <view class="fortune-title">
			  <text class="section-info">仅供娱乐\n</text>
            <text class="fortune-type">【{{ fortune.type }}】</text>
          </view>

          <view class="fortune-poem two-column">
            <view class="poem-line">
              <text>{{ fortune.poem.split('\n')[0] }}</text>
              <text>{{ fortune.poem.split('\n')[1] }}</text>
            </view>
            <view class="poem-line">
              <text>{{ fortune.poem.split('\n')[2] }}</text>
              <text>{{ fortune.poem.split('\n')[3] }}</text>
            </view>
          </view>

          <view class="divider"></view>

          <view class="fortune-explanation">
            <view><text class="section-title">白话文：</text> {{ fortune.career }}</view>
            <!-- <view><text class="section-title">感情：</text> {{ fortune.love }}</view>
            <view><text class="section-title">财运：</text> {{ fortune.fortune }}</view> -->
          </view>
        </scroll-view>
      </view>
      <view class="actions-wrapper">
        <button class="action-btn share-btn" open-type="share">分享</button>
        <button class="action-btn again-btn" @click="goHome">返回</button>
      </view>
    </view>
  </view>
</template>

<script>
import fortuneData from "@/common/data.json";
import resource from '@/common/resource.js';
export default {
  data() {
    return {
	  result: resource.CARD_RESULT_URL,
      fortune: {
        id: 1,
        title: '',
        type: '',
        text: '',
        poem: '',
        career: '',
        love: '',
        fortune: ''
      }
    };
  },
  computed: {
    resultImageUrl() {
      const cache = getApp().globalData.imageCache || {};
      return cache[this.result] || this.result;
    }
  },
  onLoad(options) {
    const id = Number(options.id);
    if (id) {
      const qian = fortuneData.find(item => item.id === id);
      if (qian) {
        this.fortune = { ...qian };
      }
    }
  },
  onShareAppMessage() {
    return {
      title: `我抽到的签「${this.fortune.type}」：${this.fortune.career}`,
      path: "/pages/result/result?id=" + this.fortune.id,
    };
  },
  onShareTimeline() {
    return {
      title: `签文「${this.fortune.title}」：${this.fortune.career}`,
      query: "id=" + this.fortune.id,
    };
  },
  methods: {
	  // 从全局缓存拿本地路径，否则用原 URL
    goHome() {
      uni.reLaunch({
        url: "/pages/draw/draw",
      });
    },
  },
};
</script>

<style>
page {
  margin: 0;
  padding: 0;
  background-color: #fdf6e3;
}

.result-page {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #fdf6e3;
}

.bg-image {
  position: absolute; 
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.foreground-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
}

.content-area {
  width: 84%;
  height: 60vh;
  margin-top: 25vh;
  box-sizing: border-box;
  padding: 40rpx;
  color: #4A2B13;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.scrollable-content {
  height: 100%;
}

.fortune-title {
  text-align: center;
  font-size: 44rpx;
  font-weight: bold;
  color: #6B3E26;
  font-family: "STKaiti", "KaiTi", serif;
  margin-bottom: 30rpx;
}

.fortune-type {
  font-size: 34rpx;
  color: #FFD700;
  text-shadow: 1rpx 1rpx 2rpx rgba(0,0,0,0.4);
  font-weight: bold;
  margin-left: 8rpx;
}

.fortune-poem.two-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 0;
}

.poem-line {
  display: flex;
  justify-content: center;
  gap: 40rpx;
  font-size: 36rpx;
  color: #4A2B13;
  font-family: "STKaiti", "KaiTi", serif;
}

.divider {
  width: 80%;
  height: 1rpx;
  background-color: rgba(74, 55, 40, 0.3);
  margin: 40rpx auto;
}

.fortune-explanation {
  font-size: 30rpx;
  line-height: 2.0;
  color: #3D2A19;
  text-align: justify;
  font-family: "STKaiti", "KaiTi", serif;
}

.section-title {
  display: inline-block;
  margin-top: 16rpx;
  margin-bottom: 6rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #FFD700; /* 更亮，更明显 */
    text-shadow: 1rpx 1rpx 2rpx rgba(0,0,0,0.3); /* 提升对比 */
}

.actions-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30rpx 40rpx 60rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.action-btn {
  width: 45%;
  font-size: 32rpx;
  border-radius: 50rpx;
  color: #fff;
  border: none;
  padding: 18rpx 0;
  font-family: sans-serif;
}

.share-btn {
  background: linear-gradient(135deg, #D4AF37, #C89B6D);
  box-shadow: 0 4rpx 10rpx rgba(212, 175, 55, 0.4);
}

.section-info{
	color: #fff8dc;
	  text-align: center;
	  margin: 0;            /* 去除默认外边距 */   /* 仅加一点顶间距，看起来美观 */
}
.again-btn {
  background: linear-gradient(135deg, #9a7852, #8b5a2b);
  box-shadow: 0 4rpx 10rpx rgba(139, 90, 43, 0.4);
}
</style>