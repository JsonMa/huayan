const _ = require('lodash');

module.exports = (app) => {
  /**
   * User 相关路由
   *
   * @class UserController
   * @extends {app.Controller}
   */
  class UserController extends app.Controller {
    /**
   * 获取 user orders 的参数规则
   *
   * @readonly
   * @memberof UserController
   */
    get indexRule() {
      return {
        properties: {
          name: {
            type: 'string',
            maxLength: 20,
            minLength: 1,
          },
          phone: this.ctx.helper.rule.phone,
          status: {
            type: 'string',
            enum: [
              'ON',
              'OFF',
            ],
          },
          ...this.ctx.helper.rule.pagination,
        },
        $async: true,
        additionalProperties: false,
      };
    }

    /**
     * 参数规则-用户详情
     *
     * @readonly
     * @memberof UserController
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
     * 参数规则-创建用户
     *
     * @readonly
     * @memberof UserController
     */
    get createRule() {
      return {
        properties: {
          name: {
            type: 'string',
            maxLength: 20,
            minLength: 1,
          },
          phone: this.ctx.helper.rule.phone,
          password: {
            type: 'string',
            maxLength: 20,
            minLength: 6,
          },
        },
        required: ['phone', 'password'],
        $async: true,
        additionalProperties: false,
      };
    }

    /**
     *  参数规则-修改用户
     *
     * @readonly
     * @memberof UserController
     */
    get updateRule() {
      return {
        properties: {
          id: this.ctx.helper.rule.uuid,
          name: {
            type: 'string',
            maxLength: 20,
            minLength: 1,
          },
          address: {
            type: 'string',
            maxLength: 30,
            minLength: 1,
          },
          phone: this.ctx.helper.rule.phone,
          password: {
            type: 'string',
            maxLength: 20,
            minLength: 6,
          },
          avatar_id: this.ctx.helper.rule.uuid,
          url: this.ctx.helper.rule.url,
          status: {
            type: 'string',
            enum: [
              'ON',
              'OFF',
            ],
          },
          picture_ids: {
            type: 'array',
            items: this.ctx.helper.rule.uuid,
          },
        },
        $async: true,
        additionalProperties: false,
      };
    }

    /**
     * 获取用户列表
     *
     * @memberof UserController
     * @returns {array} 用户列表
     */
    async index() {
      const { ctx, indexRule } = this;
      const { user } = ctx.service;
      const {
        name, phone, status, sort, start, count,
      } = await ctx.validate(indexRule, ctx.helper.preprocessor.pagination);

      // 获取用户
      const users = await user.fetch(name, phone, status, start, count, sort); // eslint-disable-line

      ctx.jsonBody = Object.assign({
        start,
        count: users.count,
        items: users.rows,
      });
    }

    /**
     * 创建用户
     *
     * @memberof UserController
     * @returns {object} 新建的用户
     */
    async create() {
      const { ctx, service, createRule } = this;
      await ctx.validate(createRule);

      const {
        name,
        phone,
        password,
      } = ctx.request.body;

      // 验证用户是否存在
      await service.user.isExisted(phone);

      // 创建用户
      const user = await service.user.create(
        name,
        phone,
        password,
      );

      ctx.jsonBody = user;
    }
  }
  return UserController;
};
