const co = require('co');
const assert = require('assert');

module.exports = (app) => {
  /**
   * 交易 Service
   *
   * @class Trade
   * @extends {app.Service}
   */
  class Trade extends app.Service {
    /**
     * 完成交易
     *
     * @param {uuid} tradeId 交易ID
     * @param {string} status 交易状态
     * @returns {Trade} trade
     * @memberof Trade
     */
    finishTrade(tradeId, status) {
      const { ctx } = this;

      /* istanbul ignore next */
      return co.wrap(function* () {
        const trade = yield app.model.Trade.findById(tradeId);
        ctx.assert(trade, '订单不存在', 25001);

        switch (status) {
          case app.model.Trade.STATUS.CLOSED:
          case app.model.Trade.STATUS.FINISHED:
            trade.status = app.model.Trade.STATUS.CLOSED;
            yield trade.save();
            break;
          case app.model.Trade.STATUS.SUCCESS:
            yield app.model.transaction(t => app.model.Order.update({
              trade_id: trade.id,
            }, {
              where: {
                id: trade.order_id,
              },
            }, {
              transaction: t,
            }).then(() => {
              trade.status = app.model.Trade.STATUS.CLOSED;
              return trade.save({
                transaction: t,
              });
            }));
            break;
          default:
            assert(false);
            break;
        }
      })();
    }
  }

  return Trade;
};
