const fs = require('fs');
const gm = require('gm');

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
     * @returns {promise} 上传的文件
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
      const { range: requestRange } = ctx.headers;

      if (requestRange) {
        const range = ctx.helper.video.range(ctx.headers.range, file.size);
        if (range) {
          const { start, end } = range;
          ctx.set({
            'Content-Range': `bytes ${start}-${end}/${file.size}`,
            'Content-Type': file.type,
            'Content-Length': file.size,
          });
          ctx.status = 206;
          ctx.body = fs.createReadStream(file.path, {
            start,
            end,
          });
        } else ctx.status = 416;
      } else {
        ctx.body = fs.createReadStream(file.path);

        ctx.set({
          'Content-Type': file.type,
          // 'Content-Length': file.size,
        });
      }
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

      ctx.error(!!~file.type.indexOf('image'), '非图片类型文件，不存在缩略图', 16003); // eslint-disable-line
      gm(fs.createReadStream(file.path))
        .resize(160, 60)
        .stream((err, data) => {
          if (err) throw err;
          else {
            ctx.body = data;
            ctx.attachment(file.name);
            ctx.set({
              'Content-Type': file.type,
              'Cache-Control': 'max-age=8640000',
            });
          }
        });
    }

    /**
     * 删除文件
     *
     * @returns {promise} 被删除的文件
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

