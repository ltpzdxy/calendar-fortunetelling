<script>
	import resource from '@/common/resource.js';
	export default {
		// 先声明这个全局缓存对象
		  globalData: {
		    imageCache: {}
		  },
		onLaunch: function() {
			console.log('App Launch')
			// 从 storage 里恢复上次缓存
			    const stored = uni.getStorageSync('imageCache') || {}
			    this.globalData.imageCache = stored
			
			    // 要缓存的远程图片列表
			    const urls = resource.CACHE_IMAGE_URLS;
			
			    urls.forEach(url => {
			      // 如果已有持久化路径，就不再下载
			      if (this.globalData.imageCache[url]) return
			
			      // 否则下载临时文件
			      uni.downloadFile({
			        url,
			        success: res => {
			          if (res.statusCode === 200) {
			            // 保存到本地持久目录，拿到永久路径
			            uni.saveFile({
			              tempFilePath: res.tempFilePath,
			              success: saveRes => {
			                const path = saveRes.savedFilePath
			                // 写入全局缓存
			                this.globalData.imageCache[url] = path
			                // 同步到 storage
			                uni.setStorageSync('imageCache', this.globalData.imageCache)
			                console.log('持久缓存成功：', url, '→', path)
			              }
			            })
			          }
			        },
			        fail: err => {
			          console.warn('downloadFile 失败：', url, err)
			        }
			      })
			    })
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>

</style>
