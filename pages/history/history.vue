<template>
  <view class="history-page">
    <view v-if="historyList.length === 0" class="no-history">暂无历史签文</view>
    <view v-else>
      <view v-for="(item, index) in historyList" :key="index" class="history-item" @click="openResult(item.id)">
        <text class="hist-time">{{ item.timeStr }}</text>
        <text class="hist-title">{{ item.title }}</text>
        <text class="hist-type">{{ item.type }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import fortuneData from '@/common/fortune-data.js'
export default {
  data() {
    return {
      historyList: []  // 历史签文列表
    }
  },
  onShow() {
    // 获取本地保存的历史签文数组
    let history = uni.getStorageSync('history') || [];
    if (!Array.isArray(history)) {
      history = [];
    }
    // 按时间倒序排列（最近的优先）
    history.sort((a, b) => b.time - a.time);
    // 生成带签文详情的列表项数据
    this.historyList = history.map(item => {
      const fortune = fortuneData.getFortuneById(item.id) || {};
      // 格式化时间
      const date = new Date(item.time);
      const Y = date.getFullYear(), M = date.getMonth() + 1, D = date.getDate();
      const h = date.getHours(), m = date.getMinutes();
      const timeStr = `${Y}-${M}-${D} ${h}:${m < 10 ? '0'+m : m}`;
      return {
        id: item.id,
        title: fortune.title || '未知签',
        type: fortune.type || '',
        timeStr: timeStr
      };
    });
  },
  methods: {
    // 打开对应签文结果页
    openResult(id) {
      uni.navigateTo({
        url: '/pages/result/result?id=' + id
      });
    }
  }
}
</script>

<style>
.history-page {
  padding: 20rpx;
}
.no-history {
  text-align: center;
  color: #888;
  margin-top: 50rpx;
}
.history-item {
  padding: 15rpx 0;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
}
.hist-time {
  color: #888;
  font-size: 12px;
  width: 160rpx;
}
.hist-title {
  font-weight: bold;
}
.hist-type {
  margin-left: 10rpx;
  color: #888;
  font-size: 14px;
}
</style>
