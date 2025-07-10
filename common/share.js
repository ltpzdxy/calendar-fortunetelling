export default {
  onLoad() {
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  onShareAppMessage() {
    // 尝试从页面自定义数据中读取
    const defaultTitle = '祎缘万年历 · 抽签·万年历·黄历·去哪玩';
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const route = currentPage?.route || '/pages/draw/draw';
    const options = currentPage?.options || {}; // 获取 query 参数

    // 把参数拼接成 query 字符串
    const query = Object.keys(options).map(key => `${key}=${options[key]}`).join('&');
    const path = query ? `/${route}?${query}` : `/${route}`;

    return {
      title: defaultTitle,
      path,
      //imageUrl: '/static/share-img.png'
    }
  },

  onShareTimeline() {
    return {
      title: '祎缘万年历 · 抽签·万年历·黄历·去哪玩',
      query: ''
    }
  }
}
