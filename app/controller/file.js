const fs = require('fs');
const gm = require('gm');
const path = require('path');

module.exports = (app) => {
  /**
   * file相关Controller
   *
   * @class fileController
   * @extends {app.Controller}
   */
  class fileController extends app.Controller {
    /**
     * 参数验证-上传文件
     *
     * @readonly
     * @memberof fileController
     */
    get uploadRule() {
      return {
        properties: {
          files: {
            type: 'array',
            items: this.ctx.helper.rule.file,
          },
        },
        required: ['files'],
        $async: true,
        additionalProperties: false,
      };
    }
    /**
     * 参数验证-获取文件
     *
     * @readonly
     * @memberof fileController
     */
    get showRule() {
      return {
        properties: {
          id: this.ctx.helper.rule.uuid,
        },
        required: ['id'],
        $async: true,
        additionalProperties: false,
      };
    }

    /**
     * 上传文件
     *
     * @memberof fileController
     * @returns {object} 上传的文件
     */
    async upload() {
      const { ctx, uploadRule } = this;
      const { files } = ctx.request;
      ctx.authPermission();
      await ctx.validate(uploadRule);

      const reqFiles = files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        path: file.path,
      }));
      const createdFiles = await app.model.File.bulkCreate(reqFiles);

      ctx.jsonBody = createdFiles.map(file => ({
        id: file.id,
        name: file.name,
        size: file.size,
        type: file.type,
      }));
    }

    /**
     * 获取文件
     *
     * @memberof fileController
     * @returns {promise} 文件详情
     */
    async show() {
      const { ctx, service, showRule } = this;
      await ctx.validate(showRule);
      const file = await service.file.getByIdOrThrow(ctx.params.id);

      ctx.body = fs.createReadStream(file.path);
      ctx.type = file.type;
      ctx.attachment(file.name);
      ctx.set('Cache-Control', 'max-age=8640000');
    }

    /**
     * 获取图片缩略图
     *
     * @memberof fileController
     * @returns {promise} 缩略图
     */
    async thumbnail() {
      const { ctx, service, showRule } = this;
      await ctx.validate(showRule);
      const file = await service.file.getByIdOrThrow(ctx.params.id);

      const imgPath = path.join(app.config.baseDir, '/files/head_12.png');
      const writeStream = fs.createWriteStream(path.join(app.config.baseDir, '/files/stream.png'));

      gm(imgPath).resize(100, 100).write(path.join(app.config.baseDir, '/files/stream.png'), (err) => {
        if (err) app.logger.error(err);
        app.logger.info('done');
      });
      // ctx.type = file.type;
      // ctx.attachment(file.name);
      // ctx.set('Cache-Control', 'max-age=8640000');
      // gm1('public/images/chat/abc.jpg')
      // .resize(240, 240,'!')
      // .toBuffer(function(err,data){
      //     if(!err)
      //     {
      //         res.set('Content-Type','image/png');
      //         res.send(data);
      //     }
      //     else
      //     {
      //         console.log(err);
      //     }}
      // )
    }

    /**
     * 删除文件
     *
     * @returns {object} 被删除的文件
     * @memberof fileController
     */
    async delete() {
      const { ctx, service, showRule } = this;
      const { id } = await ctx.validate(showRule);
      await service.file.getByIdOrThrow(id);

      const file = await ctx.service.file.delete(id);
      ctx.jsonBody = file;
    }
  }
  return fileController;
};

