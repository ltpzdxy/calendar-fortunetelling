<template>
  <view class="detail-page" v-if="lunarData">
    <!-- 1. 顶部日期导航 -->
    <view class="header-nav">
      <view class="arrow" @click="changeDate(-1)">＜</view>
      <view class="date-display">{{ solar.toYmd() }} {{ lunarData.monthInChinese }}月{{ lunarData.dayInChinese }}</view>
      <view class="arrow" @click="changeDate(1)">＞</view>
    </view>
    <view class="sub-header">{{ lunarData.yearInGanZhi }}年 {{ lunarData.monthInGanZhi }}月 {{ lunarData.dayInGanZhi }}日 [{{ lunarData.shengXiao }}年] 周{{ lunarData.weekInChinese }}</view>

    <view class="content-wrapper">
      <!-- 2. 宜忌 -->
      <view class="section section-yi-ji">
        <view class="yi">
          <view class="tag-yi">宜</view>
          <view class="text">{{ lunarData.dayYi.join('  ') }}</view>
        </view>
        <view class="ji">
          <view class="tag-ji">忌</view>
          <view class="text">{{ lunarData.dayJi.join('  ') }}</view>
        </view>
      </view>

	  <!-- 6. 时辰宜忌 -->
	  <view class="section">
	    <view class="section-title">时辰宜忌</view>
	    <view class="shichen-grid">
	      <view class="shichen-header">
	        <text v-for="(gz, index) in timeGan" :key="'gan-' + index">{{ gz }}</text>
	      </view>
	      <view class="shichen-header">
	        <text v-for="(dz, index) in timeZhi" :key="'zhi-' + index">{{ dz }}</text>
	      </view>
	      <view class="shichen-luck">
	        <text v-for="(luck, index) in timeLucks" :key="'luck-' + index" :class="{'good': luck === '吉'}">{{ luck }}</text>
	      </view>
	    </view>
	  </view>
	  
		
      <!-- 3. 五行冲煞 -->
      <view class="section section-wuxing">
        <view class="item">
          <text class="label">五行</text>
          <text class="value">{{ lunarData.dayNaYin }}</text>
        </view>
        <view class="item">
          <text class="label">冲煞</text>
          <text class="value">冲{{ lunarData.dayChongDesc }}</text>
        </view>
        <view class="item">
          <text class="label">值神</text>
          <text class="value">{{ lunarData.zhiXing }}</text>
        </view>
		<view class="item">
		  <view class="label">星宿</view>
		  <view class="value">{{ lunarData.xiu }}</view>
		</view>
      </view>

      <!-- 4. 诸神方位 -->
      <view class="section">
        <view class="section-title">诸神方位</view>
        <view class="gods-position">
          <text>财神-{{ lunarData.dayCaiShen }}</text>
          <text>喜神-{{ lunarData.dayXiShen }}</text>
          <text>福神-{{ lunarData.dayFuShen }}</text>
          <text>阳贵-{{ lunarData.yangGuiShen }}</text>
        </view>
      </view>

      <!-- 5. 综合信息区 -->
      <view class="section section-grid">
        <!-- 左侧: 建除十二神 -->
        <view class="jianchu-container">
          <!-- 左侧建除十二神 -->
          <view class="jianchu-col">
            <text>建</text>
            <text>除</text>
            <text>十</text>
            <text>二</text>
            <text>神</text>
          </view>
        
          <!-- 右侧当日建除神 -->
          <view class="jianchu-col right">
              <text>{{ lunarData.jian }}</text>
              <text>日</text>
            </view>
        </view>

        
        <!-- 中间: 吉神/胎神/凶神 -->
        <view class="grid-col center-info">
            <view class="info-block">
                <view class="title">吉神宜趋</view>
                <view class="content">{{ lunarData.dayJiShen.join(' ') }}</view>
            </view>
            <view class="info-block">
                <view class="title">今日胎神</view>
                <view class="content">{{ lunarData.dayTaiShen }}</view>
            </view>
             
        </view>

        <!-- 右侧: 彭祖百忌/星宿 -->
        <view class="grid-col right-info">
			<view class="info-block">
			    <view class="title">凶神宜忌</view>
			    <view class="content">{{ lunarData.dayXiongSha.join(' ') }}</view>
			</view>
          <view class="info-block">
            <view class="title">彭祖百忌</view>
            <view class="content">{{ lunarData.pengZuGan }} {{ lunarData.pengZuZhi }}</view>
          </view>
          
        </view>
      </view>
      

    </view>
  </view>
</template>

<script>
import { Solar } from 'lunar-javascript';

export default {
  data() {
    return {
      solar: null,
      lunarData: null,
      jianChuList: ['建', '除', '满', '平', '定', '执', '破', '危', '成', '收', '开', '闭'],
      timeGan: [],
      timeZhi: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
      timeLucks: []
    };
  },
	onShow() {
	  const dateStr = uni.getStorageSync('selectedDateForHuangli')
	  if (dateStr) {
	    this.loadDate(dateStr)
	  } else {
	    this.loadDate(new Date())
	  }
	},
  onLoad(options) {
    uni.$on('dateSelected', this.loadDate);
    if (options.date) {
      this.loadDate(options.date);
    } else {
      this.loadDate(new Date());
    }
  },
  onUnload() {
    uni.$off('dateSelected', this.loadDate);
  },
  methods: {
    loadDate(date) {
	  const xiuMapping = {
	      '角': { zheng: '木', animal: '蛟' },
	      '井': { zheng: '木', animal: '犴' },
	      '奎': { zheng: '木', animal: '狼' },
	      '斗': { zheng: '木', animal: '獬' },
	      '亢': { zheng: '金', animal: '龙' },
	      '鬼': { zheng: '金', animal: '羊' },
	      '娄': { zheng: '金', animal: '狗' },
	      '牛': { zheng: '金', animal: '牛' },
	      '氐': { zheng: '土', animal: '貉' },
	      '柳': { zheng: '土', animal: '獐' },
	      '胃': { zheng: '土', animal: '彘' },
	      '女': { zheng: '土', animal: '蝠' },
	      '房': { zheng: '日', animal: '兔' },
	      '星': { zheng: '日', animal: '马' },
	      '昴': { zheng: '日', animal: '鸡' },
	      '虚': { zheng: '日', animal: '鼠' },
	      '心': { zheng: '月', animal: '狐' },
	      '张': { zheng: '月', animal: '鹿' },
	      '毕': { zheng: '月', animal: '乌' },
	      '危': { zheng: '月', animal: '燕' },
	      '尾': { zheng: '火', animal: '虎' },
	      '翼': { zheng: '火', animal: '蛇' },
	      '觜': { zheng: '火', animal: '猴' },
	      '室': { zheng: '火', animal: '猪' },
	      '箕': { zheng: '水', animal: '豹' },
	      '轸': { zheng: '水', animal: '蚓' },
	      '参': { zheng: '水', animal: '猿' },
	      '壁': { zheng: '水', animal: '獝' }
	    };
      const d = date instanceof Date ? date : new Date(date);
      this.solar = Solar.fromDate(d);
      const lunar = this.solar.getLunar();
	  
	  const xiuName = lunar.getXiu();
	  const xiuInfo = xiuMapping[xiuName] || { zheng: '', animal: '' };

      // [CORRECTED] Using the right method names from the library
      this.lunarData = {
        monthInChinese: lunar.getMonthInChinese(),
		dayInChinese: lunar.getDayInChinese(),
		yearInGanZhi: lunar.getYearInGanZhi(),
		monthInGanZhi: lunar.getMonthInGanZhi(),
		dayInGanZhi: lunar.getDayInGanZhi(),
		shengXiao: lunar.getYearShengXiao(),
		weekInChinese: lunar.getWeekInChinese(),
		dayYi: lunar.getDayYi(),
		dayJi: lunar.getDayJi(),
		dayNaYin: lunar.getDayNaYin(),
		dayChongDesc: lunar.getDayChongDesc(),
		zhiXing: lunar.getDayTianShen(),
		dayCaiShen: lunar.getDayPositionCaiDesc(),
		dayXiShen: lunar.getDayPositionXiDesc(),
		dayFuShen: lunar.getDayPositionFuDesc(),
		yangGuiShen: lunar.getDayPositionYangGuiDesc(),
		jian: lunar.getZhiXing(),
		dayJiShen: lunar.getDayJiShen(),
		dayTaiShen: lunar.getDayPositionTai(),
		dayXiongSha: lunar.getDayXiongSha(),
		pengZuGan: lunar.getPengZuGan(),
		pengZuZhi: lunar.getPengZuZhi(),
		xiu: `${xiuName}${xiuInfo.zheng}${xiuInfo.animal}`,
		xiuLuck: lunar.getXiuLuck(),
		xiuSong: lunar.getXiuSong()
      };
      
      this.calculateTimeLucks(lunar);
    },
    changeDate(offset) {
        // [CORRECTED] Get the next Solar object
        const nextSolar = this.solar.next(offset);
        // Manually create a new standard JavaScript Date object
        const newDate = new Date(nextSolar.getYear(), nextSolar.getMonth() - 1, nextSolar.getDay());
        this.loadDate(newDate);
    },
    calculateTimeLucks(lunar) {
        const times = lunar.getTimes().slice(0, 12);
        this.timeLucks = times.map(time => time.getTianShenLuck());
        this.timeGan = times.map(time => time.getGan());
    }
  }
};
</script>

<style scoped>
/* 整体页面样式 */
.detail-page {
  padding: 20rpx;
  background-color: #fffaf0;
  min-height: 100vh; 
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* 顶部导航 */
.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 40rpx;
  font-weight: bold;
  padding: 20rpx 0;
  color: #c82c23;
}
.arrow {
  padding: 10rpx 20rpx;
  font-size: 50rpx;
  color: #999;
}
.sub-header {
  text-align: center;
  color: #888;
  font-size: 26rpx;
  margin-bottom: 20rpx;
}
.content-wrapper {
  background-color: #fdf6ec;
  border-radius: 16rpx;
  border: 2rpx solid #8b5e3c; /* 棕色圆角边框 */
    padding: 20rpx;
    box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.08); /* 适当阴影，层次感 */
}

/* 通用区块 */
.section {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}
.section:last-child {
  border-bottom: none;
}
.section-title {
  text-align: center;
  font-weight: bold;
  font-size: 32rpx;
  margin-bottom: 20rpx;
  color: #ff5722;
}

.jianchu-container {
  display: flex;
    justify-content: center;
    align-items: center; 
	font-weight: bold;
}

.jianchu-col {
   display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 10rpx;
}
.jianchu-col.right {
  justify-content: center;
}



.jianchu-col text {
  font-size: 28rpx;
  /* font-weight: bold; */
  color: #ff5722;
  margin-bottom: 4rpx;
}

.jianchu-col.right text {
  color: #333 !important;  /* 右侧内容值默认色 */
}

/* 宜忌 */
.section-yi-ji {
  display: flex;
  flex-direction: column; /* Changed for better layout */
}
.section-yi-ji .yi, .section-yi-ji .ji {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10rpx;
  font-size: 28rpx;
}
.tag-yi, .tag-ji {
  width: 40rpx;
  height: 40rpx;
  line-height: 40rpx;
  text-align: center;
  border-radius: 50%;
  color: #fff;
  margin-right: 20rpx;
  flex-shrink: 0;
}
.tag-yi { background-color: #e74c3c; }
.tag-ji { background-color: #3498db; }
.section-yi-ji .text {
  line-height: 1.6;
  word-break: break-all;
}

/* 五行冲煞 */
.section-wuxing {
  display: flex;
  justify-content: space-around;
  text-align: center;
  font-size: 28rpx;
}
.section-wuxing .item .label {
  color: #ff5722;
  display: block;
  font-weight: bold;
  font-size: 24rpx;
  margin-bottom: 8rpx;
}
.section-wuxing .item .value {
  /* font-weight: bold; */
}

/* 诸神方位 */
.gods-position {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  font-size: 28rpx;
  color: #555;
  line-height: 1.8;
}

/* 综合信息区 */
.section-grid {
  display: flex;
  justify-content: space-between;
}
.grid-col {
  display: flex;
  flex-direction: column;
}
.jianchu {
  align-items: center;
  font-size: 28rpx;
  padding: 0 20rpx;
  color: #888;
}
.jianchu view {
  margin-bottom: 10rpx;
}
.jianchu .highlight {
  color: #e74c3c;
  font-weight: bold;
}
.center-info {
  flex-grow: 1;
  padding: 0 20rpx;
  border-left: 1rpx solid #eee;
  border-right: 1rpx solid #eee;
}
.info-block {
  font-size: 26rpx;
  margin-bottom: 20rpx;
}
.info-block:last-child {
  margin-bottom: 0;
}
.info-block .title {
  color: #ff5722;
  text-align: center;
  margin-bottom: 8rpx;
  font-weight: bold;
}
.info-block .content {
	color: #333; 
  line-height: 1.5;
  text-align: center;
}
.right-info {
  width: 200rpx;
  flex-shrink: 0;
  padding: 0 20rpx;
}



/* 时辰宜忌 */
.shichen-grid {
  display: flex;
  flex-direction: column;
  font-size: 24rpx;
  text-align: center;
}
.shichen-header, .shichen-luck {
  display: flex;
}
.shichen-header text, .shichen-luck text {
  flex: 1;
  padding: 8rpx 0;
}
.shichen-header {
  color: #999;
}
.shichen-luck .good {
  color: #e74c3c;
  font-weight: bold;
}
</style>
