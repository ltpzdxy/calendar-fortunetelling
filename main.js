import App from './App'
import shareMixin from '@/common/share.js'
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import uView from 'uview-ui';
Vue.use(uView);
Vue.config.productionTip = false
App.mpType = 'app'


Vue.mixin(shareMixin)

const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  
    // Vue3 全局注册分享 mixin（用的还是 shareMixin）
  app.mixin(shareMixin)

  return {
    app
  }
}
// #endif