// @ts-nocheck
const path = require('path');
const fs = require('fs');

const { Subscription } = require('egg');
/**
 * 临时文件清除
 *
 * @class ClearTemp
 * @extends {Subscription}
 */
class ClearTemp extends Subscription {
  /**
   * 定时任务配置
   *
   * @readonly
   * @static
   * @memberof ClearTemp
   * @returns {void} 无返回
   */
  static get schedule() {
    return {
      // cron: '0 0 24 * * *',
      interval: '30s',
      type: 'worker',
      immediate: true,
      disable: false,
    };
  }

  /**
   * 定时任务
   *
   * @memberof ClearTemp
   * @returns {promise} 无返回
   */
  async subscribe() {
    const tempVideo = await this.app.redis.get('tempVideo');
    if (tempVideo) {
      tempVideo.split(',').forEach((videoPath) => {
        if (videoPath) {
          const absPath = path.join(this.app.baseDir, videoPath);
          try {
            fs.unlinkSync(absPath);
          } catch (error) {
            this.app.logger.error(error);
          }
        }
      });
      await this.app.redis.set('tempVideo', '');
    }
  }
}

module.exports = ClearTemp;
