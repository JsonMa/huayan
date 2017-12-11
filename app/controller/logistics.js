module.exports = (app) => {
  /**
   * Logistics 相关路由
   *
   * @class LogisticsController
   * @extends {app.Controller}
   */
  class LogisticsController extends app.Controller {
    /**
     * create logistics 的参数规则
     *
     * @readonly
     * @memberof LogisticsController
     */
    get rule() {
      return {
        properties: {
          order_id: this.ctx.helper.rule.uuid,
          company: { type: 'string', minLength: 1, maxLength: 32 },
          order_no: { type: 'string', minLength: 1, maxLength: 32 },
        },
        required: ['order_id', 'company', 'order_no'],
        $async: true,
        additionalProperties: false,
      };
    }

    /**
     * fetch logisticses list
     *
     * @memberof LogisticsController
     * @returns {[Logistics]} logistics列表
     */
    async create() {
      const { ctx } = this;
      await ctx.validate(this.rule);

      const order = await app.model.Order.findById(ctx.request.body.order_id);
      ctx.error(order, '创建失败：订单不存在', 17001);
      ctx.checkPermission(order.user_id);
      ctx.error(order.status === app.model.Order.STATUS.PAYED, '订单状态有误，不能执行发货请求', 17002);

      const logistics = await this.app.model.Logistics.build(this.ctx.request.body).save();
      order.status = app.model.Order.STATUS.SHIPMENT;
      await order.save();

      this.ctx.jsonBody = logistics;
    }
  }
  return LogisticsController;
};
