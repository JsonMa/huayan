const { Controller } = require('egg');

/**
 * 页面路由
 *
 * @class PageController
 * @extends {Controller}
 */
class PageController extends Controller {
  /**
   * 商城页面
   *
   * @memberof PageController
   * @returns {string} mall html
   */
  async mall() {
    this.ctx.adminPermission([-1, 1]);
    this.ctx.body = this.ctx.render('/template/mall/index.html');
  }

  /**
   * 订单页面
   *
   * @memberof PageController
   * @returns {string} orders html
   */
  async orders() {
    this.ctx.adminPermission([-1, 1]);
    this.ctx.body = this.ctx.render('/template/order/index.html');
  }
  /**
   * 社区页面
   *
   * @memberof PageController
   * @returns {string} community html
   */
  async community() {
    this.ctx.adminPermission([-1, 1]);
    this.ctx.body = this.ctx.render('/template/community/index.html');
  }

  /**
   * app 帖子页面
   *
   * @memberof PageController
   * @returns {string} post html
   */
  async appPost() {
    this.ctx.body = this.ctx.render('/template/app/post/index.html');
  }
}

module.exports = PageController;
