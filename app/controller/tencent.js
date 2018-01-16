// @ts-nocheck
const util = require('utility');

module.exports = (app) => {
  /**
   * tencent相关Controller
   *
   * @class fileController
   * @extends {app.Controller}
   */
  class fileController extends app.Controller {
    /**
     * 获取common params
     *
     * @memberof fileController
     * @returns {promise} 上传的文件
     */
    async validate() {
      const config = app.config.tencent;
      const { ctx } = this;
      const { action, videoType, coverType } = ctx.request.body;
      ctx.authPermission();

      const params = {
        Action: action,
        SecretId: config.SecretId,
        Region: 'gz',
        Timestamp: Date.now(),
        Nonce: util.random(10000, 99999),
        videoType,
      };

      if (coverType) Object.assign(params, { coverType });

      const originalStr = `GETvod.api.qcloud.com/v2/index.php?${this.stringfy(params)}`;
      const Signature = this.sign(config.SecretKey, originalStr);
      params.Nonce = util.random(10000, 99999);
      params.Timestamp = Date.now();
      const COMMON_PARAMS = this.stringfy(Object.assign(params, { Signature }));

      const resp = await app.curl(`https://vod.api.qcloud.com/v2/index.php?${COMMON_PARAMS}`, { dataType: 'json' });

      ctx.jsonBody = resp;
    }

    /**
     * 字符串化
     *
     * @param {object} param 请求参数
     * @returns {string} 签名
     * @memberof Wechat
     */
    stringfy(param) {
      return `${Object.keys(param).sort().map(key => `${key}=${param[key]}`).join('&')}`;
    }

    /**
     * 签名
     *
     * @param {string} key api key
     * @param {string} str 签名字符串
     * @returns {string} 签名
     * @memberof fileController
     */
    sign(key, str) {
      return util.hmac('sha1', key, str);
    }
  }
  return fileController;
};

