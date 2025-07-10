<template>
  <view class="page-container">
    <!-- 背景层：多层渐变动态背景 -->
    <view class="layer layer1"></view>
    <view class="layer layer2"></view>
    <view class="layer layer3"></view>

    <!-- 页面内容 -->
    <view class="content">
      <!-- 顶部标题 -->
      <view class="header">
		  <text class="title">今天吃什么？</text>
		  <button class="edit-btn" @click="showEditModal = true">去除不爱吃的食物</button>
		  </view>
      <!-- 3×3 卡牌网格 -->
      <view class="card-grid">
        <view
          v-for="(_, index) in cards"
              key="index"
              class="card"
              @tap="openCard(index)"
        >
          <image
            :src="cardFrontLocal"
            mode="aspectFill"
            class="card-image"
			style="width:100%;height:100%;"
          />
        </view>
      </view>
    </view>
	
	<view class="modal-mask" v-if="showEditModal" @tap="closeEdit">
	  <view class="modal-dialog" @tap.stop>
	    <text class="modal-title">去除不爱吃的食物</text>
	    <view class="edit-list">
	      <view v-for="(food, i) in foodOptions" :key="i" class="edit-item">
	        <text class="item-index">{{ i + 1 }}.</text>
	        <input
	          class="edit-input"
	          v-model="foodOptions[i]"
	          placeholder="请输入食物名称"
	        />
	      </view>
	    </view>
	    <!-- 按钮一行右对齐 -->
	    <view class="edit-footer">
	      <button class="btn cancel" @tap="closeEdit">取消</button>
	      <button class="btn save"   @tap="saveEdit">保存</button>
	    </view>
	  </view>
	</view>
	
    <!-- 模态食物结果弹窗 -->
    <view class="modal-mask" v-if="showModal" @tap="closeModal">
      <view class="modal-wrapper" @tap.stop>
        <view class="modal-card-container">
          <!-- 3D 翻转卡牌 使用图片正反面 -->
          <view class="modal-card" :class="{ flipped: isFlipped }">
            <!-- 卡背图 -->
            <view class="modal-face modal-back">
              <view class="modal-face modal-back">
                  <image
                    :src="cardBackLocal"
                    mode="aspectFill"
                    class="modal-image"
                    style="width:100%;height:100%;"
                  />
                </view>
            </view>
            <!-- 卡面图 + 文字 -->
            <view class="modal-face modal-front">
               <image
                    :src="cardFrontLocal"
                    mode="aspectFill"
                    class="modal-image"
                    style="width:100%;height:100%;"
                  />
              <text class="food-text">{{ selectedFood }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
	import resource from '@/common/resource.js';
export default {
  data() {
    return {
      // 九张卡片的占位
	   cards: Array.from({ length: 9 }),
	   cardFrontUrl: resource.CARD_FRONT_URL,  // 替换成从 resource 中拿
	   cardBackUrl: resource.CARD_BACK_URL,
	   // 可编辑的食物选项
	   foodOptions: ['火锅','寿司','烧烤','汉堡','沙拉','烤鸭','麻辣烫','披萨','螺蛳粉'],
	   // 随机出的结果
	   selectedFood: '',
	   // 控制弹窗和翻牌
	   showModal: false,
	   isFlipped: false,
	   showEditModal: false,
	   showResultModal: false
    };
  },
  computed: {
    cardFrontLocal() {
      const cache = getApp().globalData.imageCache || {};
      return cache[this.cardFrontUrl] || this.cardFrontUrl;
    },
    cardBackLocal() {
      const cache = getApp().globalData.imageCache || {};
      return cache[this.cardBackUrl] || this.cardBackUrl;
    }
  },
  methods: {
    // 从全局缓存拿本地路径，否则用原 URL
    openCard(food) {
	const rand = Math.floor(Math.random() * this.foodOptions.length);
	this.selectedFood = this.foodOptions[rand];
	// 显示 modal 并翻牌
    this.showModal = true;
    this.isFlipped = false;
      // 下一轮 tick 后启动翻转
      this.$nextTick(() => {
        setTimeout(() => {
          this.isFlipped = true;
        }, 50);
      });
    },
    closeModal() {
      this.showModal = false;
      this.isFlipped = false;
    },
	 closeEdit() {
	    this.showEditModal = false;
	  },
	  saveEdit() {
	    // 去掉空白、控制不超过9条
	    this.foodOptions = this.foodOptions
	      .map(f => f.trim())
	      .filter(f => f !== '')
	      .slice(0, 9);
	    while (this.foodOptions.length < 9) {
	      this.foodOptions.push('');
	    }
	    this.showEditModal = false;
	  }
  }
};
</script>

<style scoped>
.page-container {
  position: relative;
  width: 100%; height: 100vh;
  overflow: hidden;
  background-color: #fdf6e3;
}
.layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
.layer1 { background: linear-gradient(120deg, rgba(228,201,159,0.4), rgba(248,241,228,0.4)); animation: drift1 30s linear infinite; }
.layer2 { background: radial-gradient(circle at 25% 40%, rgba(255,255,255,0.3), transparent 50%), radial-gradient(circle at 75% 70%, rgba(255,255,255,0.2), transparent 60%); animation: drift2 45s ease-in-out infinite; }
.layer3 { background: repeating-radial-gradient(circle at center, rgba(0,0,0,0.02) 0, rgba(0,0,0,0) 10px); opacity: 0.1; animation: drift3 60s linear infinite; }
@keyframes drift1 { 0% { background-position:0% 0%; } 50% { background-position:-15% -10%; } 100% { background-position:0% 0%; } }
@keyframes drift2 { 0% { background-position:0% 0%,100% 100%; } 50% { background-position:20% 10%,80% 60%; } 100% { background-position:0% 0%,100% 100%; } }
@keyframes drift3 { from { background-position:0 0; } to { background-position:100px 100px; } }

.content { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }
.header {
  /* 水平排布，左对齐，垂直居中 */
  display: flex;
  align-items: center;
  justify-content: center;
   width: 100%;
    padding: 0 20rpx;
    margin-top: 40rpx;
    z-index: 1;
    position: relative;
}

.title {
  flex: 1;
    text-align: center;
    font-size: 36rpx;
    color: #8A6535;
    font-weight: bold;
  line-height: 1;        /* 防止按钮高度被撑大 */
}

.edit-btn {
  position: absolute;
    right: 30rpx;
    /* 以下样式保持不变 */
    background-color: rgba(191,160,88,0.2);
    border: 2rpx solid #BFA058;
    color: #ff5722;
    font-size: 28rpx;
    padding: 6rpx 16rpx;
    border-radius: 12rpx;
  /* 防止按钮高度过高 */
  line-height: normal;
}
.edit-btn:active {
  background-color: rgba(191,160,88,0.4);
}

.card-grid { display: flex; flex-wrap: wrap; justify-content: space-around; width: 90%; margin-top: 20rpx; }
.card { width: 28%; padding-bottom: 37%; margin-bottom: 15rpx; position: relative; }
.card-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 12rpx; }

/* 模态框 */
.modal-mask { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10; }
.modal-wrapper { perspective: 1000rpx; }
.modal-card-container { animation: glow 1.5s ease-in-out infinite; }
.modal-card { width: 400rpx; height: 600rpx; transform-style: preserve-3d; transition: transform 0.6s ease; position: relative; }
.modal-card.flipped { transform: rotateY(180deg); }
.modal-face { position: absolute; top: 0; left: 0; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 12rpx; overflow: hidden; background-color: transparent; display: flex; align-items: center; justify-content: center; }
.modal-back { }
.modal-front { transform: rotateY(180deg); }
.modal-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.food-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 40rpx; color: #8A6535; font-weight: bold; z-index: 1; }
@keyframes glow { 0% { box-shadow: 0 0 0 0 rgba(255,215,0,0.7); } 50% { box-shadow: 0 0 20rpx 10rpx rgba(255,215,0,0.3); } 100% { box-shadow: 0 0 0 0 rgba(255,215,0,0); } }

.modal-mask {
  position: fixed; top:0; left:0;
  width:100%; height:100%;
  background: rgba(0,0,0,0.4);
  display:flex; align-items:center; justify-content:center;
  z-index: 100;
}
/* 弹窗主体 */
.modal-dialog {
  width: 80%;
  max-height: 80%;
  background-color: #FDF8E5;   /* 米黄底 */
  border: 2rpx solid #BFA058;  /* 棕黄边框 */
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 0 30rpx rgba(0,0,0,0.1);
}
/* 标题 */
.modal-title {
  font-size: 32rpx;
  color: #8A6535;
  text-align: center;
  margin-bottom: 20rpx;
  font-weight: bold;
}
/* 列表滚动区域 */
.edit-list {
  max-height: 50vh;
  overflow-y: auto;
  margin-bottom: 20rpx;
}
/* 每一行 */
.edit-item {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}
.item-index {
  width: 24rpx;
  font-size: 28rpx;
  color: #8A6535;
}
.edit-input {
  flex: 1;
  border: 1rpx solid #DDD;
  border-radius: 6rpx;
  padding: 6rpx 10rpx;
  font-size: 28rpx;
  color: #5A3E1B;
  background-color: #FFF;
}
/* 按钮容器：右对齐，一行 */
.edit-footer {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
}
/* 按钮公用 */
.btn {
  padding: 8rpx 20rpx;
  font-size: 28rpx;
  border-radius: 8rpx;
  min-width: 140rpx;
}
/* 取消按钮风格 */
.btn.cancel {
  background-color: transparent;
  border: 2rpx solid #C2A15A;
  color: #C2A15A;
}
/* 保存按钮风格 */
.btn.save {
  background-color: #BFA058;
  border: none;
  color: #FFF;
}
/* 按钮按下反馈 */
.btn:active {
  opacity: 0.7;
}

</style>
