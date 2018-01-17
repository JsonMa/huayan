// @ts-nocheck
const util = require('utility');
const querystring = require('querystring');
const COS = require('cos-nodejs-sdk-v5');
const path = require('path');

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

      // VOD发起上传
      const params = {
        Action: action,
        SecretId: config.SecretId,
        Region: 'cd',
        Timestamp: parseInt(Date.now() / 1000, 10),
        Nonce: util.random(10000000, 99999999),
        videoType,
      };

      if (coverType) Object.assign(params, { coverType });

      const originalStr = `GETvod.api.qcloud.com/v2/index.php?${this.stringify(params)}`;
      const Signature = this.sign(config.SecretKey, originalStr);
      const COMMON_PARAMS = querystring.stringify(Object.assign(params, { Signature }));

      const resp = await app.curl(`https://vod.api.qcloud.com/v2/index.php?${COMMON_PARAMS}`, { dataType: 'json' });
      const { data } = resp;
      ctx.error(resp.data.code === 0, '腾讯API认证失败', 22001);

      // COS上传文件
      const cos = new COS({
        AppId: data.storageAppId,
        SecretId: config.SecretId,
        SecretKey: config.SecretKey,
      });
      const filePath = path.join(app.baseDir, '/files/test_video.mp4');
      const cosResult = await new Promise((resolve, reject) => {
        cos.sliceUploadFile({
          Bucket: data.storageBucket,
          Region: data.storageRegionV5,
          Key: 'test_video.mp4',
          FilePath: filePath,
        }, (err, res) => {
          if (err) reject(err);
          resolve(res);
        });
      });
      ctx.error(cosResult.statusCode === 200, '腾讯云文件上传失败', 22002);

      // VOD确认上传
      const vodParams = {
        Action: 'CommitUpload',
        SecretId: config.SecretId,
        Region: 'cd',
        Timestamp: parseInt(Date.now() / 1000, 10),
        Nonce: util.random(10000000, 99999999),
        vodSessionKey: data.vodSessionKey,
      };
      const vodStr = `GETvod.api.qcloud.com/v2/index.php?${this.stringify(vodParams)}`;
      const vodSignature = this.sign(config.SecretKey, vodStr);
      const VOD_COMMON_PARAMS = querystring.stringify(Object.assign(vodParams, { Signature: vodSignature }));

      const vodResp = await app.curl(`https://vod.api.qcloud.com/v2/index.php?${VOD_COMMON_PARAMS}`, { dataType: 'json' });

      ctx.error(vodResp.data.code === 0, '腾讯API视频上传失败', 22003);
      ctx.jsonBody = vodResp.data;
    }

    /**
     * 字符串化
     *
     * @param {object} param 请求参数
     * @returns {string} 签名
     * @memberof Wechat
     */
    stringify(param) {
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

