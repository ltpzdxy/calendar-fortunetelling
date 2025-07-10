<template>
  <view class="calendar-page">
    <!-- 日历组件 -->
    <gwbq-calendar
      :customColorMap="customColorMap"
      :calendarKey="calendarKey"
      :activeTags="activeTags"
      lunar
      @change="onDateChange"
      @monthDates="onMonthDates"
      @filterKeyword="onFilterKeyword"
    />

    <!-- 日期信息卡片 -->
    <view v-if="selectedInfo" class="info-card">
      <view class="info-item">🗓️ 农历：{{ selectedInfo.lunar.gzYear }}年 {{ selectedInfo.lunar.IMonthCn }}{{ selectedInfo.lunar.IDayCn }} {{ selectedInfo.lunar.monthInChinese }}月{{ selectedInfo.lunar.dayInChinese }}</view>
      <view class="info-item">🌞 节气：{{ selectedInfo.lunar.Term || '无' }}</view>
      <view class="info-item">🐯 属相：{{ selectedInfo.lunar.Animal }}</view>
      <view class="info-item">🔯 星座：{{ selectedInfo.lunar.astro }}</view>
      <view class="info-item">✅ 宜：{{ selectedInfo.huangli.yi }}</view>
      <view class="info-item">❌ 忌：{{ selectedInfo.huangli.ji }}</view>
    </view>
  </view>
</template>

<script>
import Calendar from '@/components/gwbq-calendar/calendar.js'
import huangliData from '@/static/huangli.json'
import { Solar } from 'lunar-javascript'

export default {
  data() {
    return {
      selectedInfo: null,
      huangliData,
      customColorMap: {
        // '2025-06-23': '#e74c3c',  // 红色
        // '2025-06-24': '#3498db',  // 蓝色
        // '2025-06-25': '#2ecc71'   // 绿色
      },
      calendarKey: 0,   // ⭐ 新增，用于强制刷新日历
      activeTags: [],
      filterTags: [
        { text: '出行', color: '#e74c3c' },
        { text: '嫁娶', color: '#8e44ad' },
        { text: '祭祀', color: '#3498db' },
        { text: '纳采', color: '#d35400' },
        { text: '动土', color: '#16a085' },
        { text: '安葬', color: '#2c3e50' }
      ],
      currentDates: []  // 存放当前日历可见日期
    }
  },
  methods: {
	onDateChange(e) {
	      // 从事件对象中获取完整的日期字符串，如 "2025-06-24"
	      const fullDate = e.fulldate
	      if (!fullDate) return;
		  
		  uni.setStorageSync('selectedDateForHuangli', fullDate)
	      // 将日期字符串分割成 [年, 月, 日] 数组
	      const [year, month, day] = fullDate.split('-').map(Number);
	      // 使用 lunar-javascript 创建公历对象
	      const solar = Solar.fromYmd(year, month, day);
	      // 从公历对象获取对应的农历对象
	      const lunar = solar.getLunar();
	      // 获取当天的宜和忌，并将数组转换为空格分隔的字符串
	      const yi = lunar.getDayYi().join(' ');
	      const ji = lunar.getDayJi().join(' ');
	
	      // 将所有计算出的信息整合到一个对象中
	      this.selectedInfo = {
	        lunar: {
	          gzYear: lunar.getYearInGanZhi(),      // 干支年
	          IMonthCn: lunar.getMonthInGanZhi(),  // 农历月（中文）
	          IDayCn: lunar.getDayInGanZhi(),      // 农历日（中文）
	          Term: lunar.getJieQi() || '无',      // 节气，若无则显示'无'
	          Animal: lunar.getYearShengXiao(),         // 生肖
	          astro: solar.getXingZuo(),             // 星座
			  monthInChinese: lunar.getMonthInChinese(), 
			  dayInChinese: lunar.getDayInChinese(),
	        },
	        huangli: {
	          yi: yi || '无', // 每日宜事，若无则显示'无'
	          ji: ji || '无'  // 每日忌事，若无则显示'无'
	        }
	      };
	},
		
    onMonthDates(dates) {
      this.currentDates = dates
      this.applyFilter()
	  //console.log('开始筛选当前可见日期:', this.currentDates)
    },
    onFilterKeyword(tag) {
      const index = this.activeTags.indexOf(tag)
      if (index > -1) {
        this.activeTags.splice(index, 1)
        //console.log(`取消筛选: ${tag}`)
      } else {
        this.activeTags.push(tag)
        //console.log(`新增筛选: ${tag}`)
      }
      //console.log('当前筛选标签:', this.activeTags)
      this.applyFilter()
    },
	applyFilter() {
	  const colorMap = {}
	  
	  // 如果没有激活的筛选标签，则直接清空颜色并刷新日历
	  if (this.activeTags.length === 0) {
		this.customColorMap = {};
		this.calendarKey++;
		return;
	  }
	  
	  // 遍历当前日历可见的日期
	  this.currentDates.forEach(dateStr => {
		// [FIX] 添加防御性检查，以防 dateStr 为 undefined
		if (!dateStr) {
		  return; // 跳过无效的日期条目
		}

		// 解析日期字符串
		const [year, month, day] = dateStr.split('-').map(Number);
		if (!year || !month || !day) return;

		// 使用 lunar-javascript 实时获取当天的“宜”事项
		const solar = Solar.fromYmd(year, month, day);
		const lunar = solar.getLunar();
		const yiActivities = lunar.getDayYi(); // 返回一个数组，如 ['嫁娶', '出行']

		// 如果当天有“宜”事项
		if (yiActivities && yiActivities.length > 0) {
		  // 遍历当前所有激活的筛选标签
		  this.activeTags.forEach(tag => {
			// 如果当日的“宜”事项中包含了激活的标签
			if (yiActivities.includes(tag)) {
			  // 找到该标签对应的颜色对象
			  const tagObj = this.filterTags.find(t => t.text === tag)
			  // 设置该日期的背景色。如果一个日期匹配多个标签，后面的会覆盖前面的。
			  colorMap[dateStr] = tagObj ? tagObj.color : '#e74c3c'
			}
		  })
		}
	  })

	  // 更新 customColorMap 以应用高亮
	  this.customColorMap = colorMap
	  // 递增 key 来强制刷新日历组件
	  this.calendarKey++
	}
	
  },
  mounted() {
      const today = new Date();
      const fullDate = today.toISOString().split('T')[0];
      this.onDateChange({ fulldate: fullDate });
    }
}
</script>

<style scoped>
.calendar-page {
  padding: 20rpx;
}
.info-card {
  margin-top: 20rpx;
  padding: 24rpx;
  border-radius: 20rpx;
  background-color: #fffaf0; /* 柔和米黄色卡片底色 */
    border: 2rpx solid #8b5e3c; /* 棕色边框，提升层次 */
    box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.08); /* 阴影增强立体感 */
}
.info-item {
  font-size: 30rpx;
  margin-bottom: 12rpx;
  color: #333;
}
</style>
