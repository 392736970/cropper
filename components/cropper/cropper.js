// components/cropper/cropper.js

import WeCropper from './we-cropper.js'

const app = getApp()


const device = wx.getSystemInfoSync()
console.log(device);
const width = device.windowWidth
const height = device.windowHeight - 50
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    cropperOpt: {
      id: 'cropper',
      targetId: 'targetCropper',
      pixelRatio: device.pixelRatio,
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      },
      boundStyle: {
        color: "#04b00f",
        mask: 'rgba(0,0,0,0.8)',
        lineWidth: 1
      }
    },
    /**是否还原 */
    isReduction: false
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onLoad(options) {
      if (options.src) {
        this.data.src = options.src;
      }

      this.init();
    },
    touchStart(e) {
      // this.cropper.touchStart(e)
      const isReduction = this.data.isReduction;
      this.cropper.touchStart({
        touches: e.touches.filter(i => i.x !== undefined)
      });
      if (!isReduction) {
        this.setData({
          isReduction: true
        })
      }
    },
    touchMove(e) {
      // this.cropper.touchMove(e)
      this.cropper.touchMove({
        touches: e.touches.filter(i => i.x !== undefined)
      })
    },
    touchEnd(e) {
      this.cropper.touchEnd(e)
    },
    getCropperImage() {
      let self = this;
      this.cropper.getCropperImage()
        .then((src) => {
          wx.previewImage({
            urls: [src]
          })
        })
        .catch(() => {
          console.log('获取图片地址失败，请稍后重试')
        })
    },
    /**初始化画布 */
    init() {
      const {
        cropperOpt
      } = this.data,
        self = this,
        src = this.data.src;

      cropperOpt.boundStyle.color = "#04b00f";

      this.setData({
        cropperOpt
      })

      this.cropper = new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          if (src) {
            ctx.pushOrign(src);
          }
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          wx.hideToast()
        })
    },
    /**还原画布 */
    reduction() {
      const isReduction = this.data.isReduction,
        self = this;
      if (!isReduction) return;
      this.cropper.reduction().then(() => {
        self.setData({
          isReduction: !isReduction
        })
      });
    },
    /**旋转画布 */
    rotate() {
      this.cropper.rotateAngle = this.cropper.rotateAngle + 1;
      this.cropper.rotate();
    },
    /**取消编辑 */
    cancel() {
      wx.navigateBack();
    }
  }
})
