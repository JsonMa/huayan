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
      const { role } = ctx.req.body;
      ctx.assert(role, 400); // 抛出参数错误
      let user = '';
      let password = '';

      /* istanbul ignore next */
      if (role === 'admin') {
        const {
          name: userName, password: userPassword,
        } = await ctx.validate(pcRule);
        password = userPassword;
        [user] = await this.app.model.Admin.find({
          where: { name: userName },
        });
      } else {
        const {
          phone: userPhone, password: userPassword,
        } = await ctx.validate(mobileRule);
        password = userPassword;

        [user] = await this.app.model.User.find({
          where: { phone: userPhone },
        });
      }

      /* 数据库验证 */
      const md5 = crypto.createHash('md5');
      password = md5.update(password).digest('hex');
      ctx.error(password === user.password, '用户名或密码错误');
      const token = uuid();
      app.redis.set(`${app.config.auth.prefix}:${token}`, JSON.stringify({ role, id: user.id }));
      ctx.cookies.set('access_token', token);
      ctx.jsonBody = {
        user,
        token,
      };
    }
  }
  return AuthController;
};
