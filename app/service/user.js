const {
  Service,
} = require('egg');
const crypto = require('crypto');

/**
 * User Service
 *
 * @class UserService
 * @extends {Service}
 */
class UserService extends Service {
  /**
   * 根据ids查找用户
   *
   * @param {[UUID]} ids 用户id数组
   * @memberof UserService
   * @returns {[User]} 用户数组
   */
  async findByIds(ids) {
    const { assert } = this.ctx.helper;
    assert(ids instanceof Array, 'ids需为数组');

    return this.app.model.User.findAll({
      where: {
        id: {
          $in: ids,
        },
      },
      attributes: ['id', 'name', 'nickname', 'avatar'],
    });
  }

  /**
     * 获取用户列表
     *
     * @param {string}  name        -用户名
     * @param {string}  phone       -用户手机
     * @param {string}  status      -用户状态
     * @param {string}  start       -从第几条数据开始
     * @param {string}  count       -数据条数
     * @param {string}  sort        -是否排序
     * @memberof UserService
     * @returns {promise} 返回用户列表
     */
  fetch(name, phone, status, start, count, sort) {
    const { assert } = this.ctx.helper;

    /* istanbul ignore else */
    if (name) assert(typeof name === 'string', 'name需为字符串');
    /* istanbul ignore else */
    if (phone) assert(typeof phone === 'string', 'phone需为字符串');
    /* istanbul ignore next */
    if (status) assert(status === 'ON' || status === 'OFF', 'status需为ON或OFF');

    assert(typeof start === 'number', 'start需为字符串');
    assert(typeof count === 'number', 'count需为字符串');
    assert(typeof sort === 'string', 'sort需为字符串');

    const { Op } = this.app.Sequelize;

    /* istanbul ignore next */
    const timeOrder = sort === 'true' ? ['updated_at', 'DESC'] : ['updated_at', 'ASC'];
    /* istanbul ignore next */
    const statusQuery = status === undefined ? { } : { status };
    /* istanbul ignore next */
    const nameQuery = name === undefined ? { } : {
      name: {
        [Op.like]: `%${name}%`,
      },
    };
    /* istanbul ignore next */
    const phoneQuery = phone === undefined ? { } : {
      phone: {
        [Op.like]: `%${phone}%`,
      },
    };

    return this.app.model.User.findAndCountAll({
      where: {
        ...nameQuery,
        ...phoneQuery,
        ...statusQuery,
      },
      offset: start,
      limit: count,
      order: [
        ['status', 'ASC'],
        timeOrder,
      ],
      attributes: ['id', 'no', 'name', 'address', 'phone', 'avatar_id', 'picture_ids', 'url', 'status', 'role'],
    });
  }

  /**
     * 创建用户
     *
     * @param {string}  name          -用户名称
     * @param {string}  phone         -用户手机
     * @param {int}     password      -用户密码
     * @memberof UserService
     * @returns {promise|null} 返回创建的商品
     */
  create(name, phone, password) {
    const { assert } = this.ctx.helper;

    assert(typeof password === 'string', 'password需为字符串');
    if (name || phone) {
      if (name) assert(typeof name === 'string', 'name需为字符串');
      if (phone) assert(typeof phone === 'string', 'phone需为字符串');
      const md5 = crypto.createHash('md5');
      const ecptPassword = md5.update(password).digest('hex');
      const user = {
        name,
        phone,
        password: ecptPassword,
      };

      return this.app.model.User.create(user);
    }
    assert(false, '用户名或手机至少需要选择一项');
    return null;
  }
  /**
     *  验证用户是否存在
     *
     * @param {string} phone -用户手机
     * @memberof UserService
     * @returns {promise} 返回验证结果
     */
  isExisted(phone) {
    const { assert } = this.ctx.helper;
    assert(typeof phone === 'string', 'phone需为字符串');

    return this.app.model.User.find({
      where: {
        phone,
      },
    }).then((user) => {
      this.ctx.error(!user, '用户已存在', 10003);
    });
  }
}

module.exports = UserService;
