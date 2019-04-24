//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },
  onLoad: function () {

  },
  /**上传照片 */
  upload(){
    const that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0];

        //  获取裁剪图片资源后，给data添加src属性及其值
        wx.navigateTo({
          url: `/components/cropper/cropper?src=${src}`,
        })

      }
    })
  }
})
