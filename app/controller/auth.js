const uuid = require('uuid/v4');
const crypto = require('crypto');

module.exports = (app) => {
  /**
   * Auth 相关路由
   *
   * @class AuthController
   * @extends {app.Controller}
   */
  class AuthController extends app.Controller {
    /**
     * mobile login 的参数规则
     *
     * @readonly
     * @memberof AuthController
     */
    get mobileRule() {
      return {
        properties: {
          role: {
            type: 'string',
            enum: [
              'admin',
              'user',
            ],
          },
          phone: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
        },
        required: ['phone', 'password'],
        $async: true,
        additionalProperties: false,
      };
    }

    /**
     * pc login 的参数规则
     *
     * @readonly
     * @memberof AuthController
     */
    get pcRule() {
      return {
        properties: {
          role: {
            type: 'string',
            enum: [
              'admin',
              'user',
            ],
          },
          name: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
        },
        required: ['name', 'password'],
        $async: true,
        additionalProperties: false,
      };
    }

    /**
     * login
     *
     * @memberof AuthController
     * @return {Object} user & token
     */
    async login() {
      const {
        ctx, mobileRule, pcRule,
      } = this;
      const { role } = ctx.request.body;
      ctx.assert(role, 400); // 抛出参数错误
      let user = '';
      let password = '';

      /* istanbul ignore next */
      if (role === 'admin') {
        const {
          name: userName, password: userPassword,
        } = await ctx.validate(pcRule);
        password = userPassword;
        user = await this.app.model.User.findOne({
          where: { name: userName },
        });
      } else {
        const {
          phone: userPhone, password: userPassword,
        } = await ctx.validate(mobileRule);
        password = userPassword;

        user = await this.app.model.User.findOne({
          where: { phone: userPhone },
        });
      }

      /* 数据库验证 */
      const md5 = crypto.createHash('md5');
      password = md5.update(password).digest('hex');
      ctx.error(user && password === user.password, '用户名或密码错误', 10002, 400);
      const token = uuid();
      app.redis.set(`${app.config.auth.prefix}:${token}`, JSON.stringify({ role, id: user.id }));
      ctx.cookies.set('access_token', token);
      ctx.jsonBody = {
        user,
        token,
      };
    }
    /**
     * logout
     *
     * @memberof AuthController
     * @returns {object} 返回登出结果
     */
    async logout() {
      const {
        ctx,
      } = this;
      const { token } = ctx.state.auth;

      const ret = app.redis.del(`${app.config.auth.prefix}:${token}`);
      ctx.error(ret !== 1, '退出登登录失败', 10999);
      ctx.jsonBody({
        msg: '成功退出登录',
      });
    }
  }
  return AuthController;
};
