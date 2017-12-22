const _ = require('lodash');

module.exports = (app) => {
  /**
   * 贺卡相关路由
   *
   * @class CardController
   * @extends {app.Controller}
   */
  class CardController extends app.Controller {
    /**
     * 参数规则-贺卡列表
     *
     * @readonly
     * @memberof CardController
     */
    get indexRule() {
      return {
        properties: {
          status: {
            type: 'string',
            enum: [
              'NONBLANK',
              'BLANK',
            ],
          },
          category_id: this.ctx.helper.rule.uuid,
          user_id: this.ctx.helper.rule.uuid,
          ...this.ctx.helper.rule.pagination,
        },
        $async: true,
        additionalProperties: false,
      };
    }

    /**
     * 参数规则-贺卡详情
     *
     * @readonly
     * @memberof CardController
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
     *  参数规则-修改贺卡
     *
     * @readonly
     * @memberof CardController
     */
    get updateRule() {
      return {
        properties: {
          id: this.ctx.helper.rule.uuid,
          voice_id: this.ctx.helper.rule.uuid,
          video_id: this.ctx.helper.rule.uuid,
          cover_id: this.ctx.helper.rule.uuid,
          blessing: {
            type: 'string',
            maxLength: 50,
            minLength: 1,
          },
          union_id: {
            type: 'string',
            maxLength: 36,
            minLength: 1,
          },
          picture_ids: {
            type: 'array',
            items: this.ctx.helper.rule.uuid,
          },
          status: {
            type: 'string',
            enum: [
              'NONBLANK',
              'BLANK',
            ],
          },
          background_id: this.ctx.helper.rule.uuid,
        },
        required: ['id', 'union_id'],
        $async: true,
        additionalProperties: false,
      };
    }

    /**
     * 参数规则-删除贺卡
     *
     * @readonly
     * @memberof CardController
     */
    get destroyRule() {
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
     * 参数规则-创建贺卡
     *
     * @readonly
     * @memberof CardController
     */
    get createRule() {
      return {
        properties: {
          category_id: this.ctx.helper.rule.uuid,
        },
        required: ['category_id'],
        $async: true,
        additionalProperties: false,
      };
    }

    /**
     * 获取贺卡列表
     *
     * @memberof CardController
     * @returns {array} 贺卡列表
     */
    async index() {
      const { ctx, indexRule } = this;
      const { card } = ctx.service;
      ctx.authPermission();
      const {
        user_id: userId, sort, start, count, status, category_id: categoryId,
      } = await ctx.validate(indexRule, ctx.helper.preprocessor.pagination);

      // 获取贺卡列表
      const cards = await card.fetch(userId, status, categoryId, start, count, sort);

      ctx.jsonBody = Object.assign({
        start,
        count: cards.count,
        items: cards.rows,
      });
    }

    /**
     * 获取贺卡详情
     *
     * @memberof CardController
     * @returns {object} 贺卡详情
     */
    async show() {
      const { ctx, service, showRule } = this;
      await ctx.validate(showRule);

      const { id } = ctx.params;
      const card = await service.card.getByIdOrThrow(id);
      if (card) card.click += 1;
      await card.save();

      ctx.jsonBody = card;
    }

    /**
     * 创建贺卡
     *
     * @memberof CardController
     * @returns {object} 新建的贺卡
     */
    async create() {
      const { ctx, service, createRule } = this;
      ctx.authPermission();
      const { category_id: categoryId } = await ctx.validate(createRule);
      const { id } = ctx.state.auth.user;

      // 创建贺卡
      const user = await service.user.getByIdOrThrow(id);
      ctx.error(user.card_num >= 1, '创建贺卡失败，剩余数量小于1', 17009);
      const card = await service.card.create(id, categoryId);
      if (card) {
        user.card_num -= 1;
        await user.save();
      }

      ctx.jsonBody = card;
    }

    /**
     * 修改贺卡
     *
     * @memberof CardController
     * @returns {object} 被修改的贺卡
     */
    async update() {
      const { ctx, service, updateRule } = this;
      await ctx.validate(updateRule);

      const {
        voice_id: voiceId,
        video_id: videoId,
        cover_id: coverId,
        picture_ids: pictureIds,
        background_id: backgroundId,
        union_id: unionId,
      } = ctx.request.body;
      const card = await service.card.getByIdOrThrow(ctx.params.id);

      ctx.error(card.status === 'BLANK' || unionId === card.union_id, '贺卡已经被编辑过，不能再次编辑', 17002);

      // 验证图片是否存在
      /* istanbul ignore else */
      if (pictureIds) {
        ctx.error(pictureIds.length <= 5 && pictureIds.length >= 1, '贺卡照片数量需在1~5张范围内', 17004);
        const files = await service.file.count(pictureIds, 'image');
        ctx.error(files.count === pictureIds.length, '贺卡照片重复/丢失或包含非图片类型文件', 17005);
      }

      /* istanbul ignore else */
      if (voiceId) {
        const file = await service.file.getByIdOrThrow(voiceId);
        ctx.error(!!~file.type.indexOf('audio/'), '录音文件非音频类型', 17003, 400); // eslint-disable-line
      }

      /* istanbul ignore else */
      if (videoId) {
        const file = await service.file.getByIdOrThrow(videoId);
        ctx.error(!!~file.type.indexOf('video/'), '录像文件非视频类型', 17006, 400); // eslint-disable-line
      }

      /* istanbul ignore else */
      if (coverId) {
        const file = await service.file.getByIdOrThrow(coverId);
        ctx.error(!!~file.type.indexOf('image/'), '录像封面非图片类型', 17007, 400); // eslint-disable-line
      }

      /* istanbul ignore else */
      if (backgroundId) {
        const file = await service.file.getByIdOrThrow(backgroundId);
        ctx.error(!!~file.type.indexOf('image/'), '贺卡背景非图片类型', 17008, 400); // eslint-disable-line
      }

      // 贺卡更新
      Object.assign(card, ctx.request.body);
      await card.save();

      ctx.jsonBody = card;
    }

    /**
     * 删除贺卡
     *
     * @memberof CardController
     * @returns {object} 删除的贺卡
     */
    async destroy() {
      const { ctx, service, destroyRule } = this;
      ctx.adminPermission();

      // query参数验证
      const { id } = await ctx.validate(destroyRule);

      // 查询并删除指定的贺卡
      const card = await service.card.getByIdOrThrow(id);
      await service.card.delete(id);

      ctx.jsonBody = card;
    }
  }

  return CardController;
};

