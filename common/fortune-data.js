export default {
  fortunes: [
    {
      id: 1,
      title: '第一签',
      type: '上上签',
      poem: '春日花开鸟相鸣，万事如意福相随。',
      explanation: '此签预示诸事顺利，吉祥如意。'
    },
    {
      id: 2,
      title: '第二签',
      type: '中吉签',
      poem: '云开见月明，雾散终有时。',
      explanation: '困境终将消散，前途将重现光明。'
    },
    {
      id: 3,
      title: '第三签',
      type: '中平签',
      poem: '山重水复疑无路，柳暗花明又一村。',
      explanation: '经历波折后会有转机，坚持不懈终有收获。'
    },
    {
      id: 4,
      title: '第四签',
      type: '下签',
      poem: '风雨凄凄路漫漫，静待花开见月圆。',
      explanation: '当前困难较多，需耐心等待，终会柳暗花明。'
    },
    {
      id: 5,
      title: '第五签',
      type: '上签',
      poem: '一锄掘地要求泉，有心栽花花自开。',
      explanation: '只要坚定信念并努力，最终会有意外的收获。'
    }
  ],
  // 按ID获取对应的签文对象
  getFortuneById(id) {
    return this.fortunes.find(item => item.id === id);
  }
}
