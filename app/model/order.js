module.exports = (app) => {
  const {
    UUID,
    UUIDV1,
    ENUM,
    INTEGER,
    FLOAT,
  } = app.Sequelize;

  /**
   * 订单Model
   *
   * @model Order
   * @namespace Model
   * @property {uuid}   id
   * @property {number} no                     - 订单序列号
   * @property {enum}   status                 - 订单状态 ['CREATED', 'PAYED', 'SHIPMENT', 'FINISHED']
   * @property {number} user_id                - 用户id
   * @property {uuid}   commodity_id           - 商品id
   * @property {int}    comodity_price         - 商品总价格
   * @property {int}    price                  - 实际支付价格
   * @property {int}    count                  - 商品数量
   * @property {uuid}   trade_id               - 交易id
   *
   */
  const Order = app.model.define('order', {
    id: {
      type: UUID,
      defaultValue: UUIDV1,
      primaryKey: true,
    },
    no: {
      type: INTEGER,
      autoIncrement: true,
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
    },
    commodity_id: {
      type: UUID,
      allowNull: false,
    },
    count: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    status: {
      type: ENUM,
      values: [
        'CREATED',
        'PAYED',
        'SHIPMENT',
        'FINISHED',
      ],
      defaultValue: 'CREATED',
    },
    commodity_price: {
      type: FLOAT,
      allowNull: false,
    },
    price: FLOAT,
    trade_id: UUID,
  }, {
    getterMethods: {
      realPrice() {
        return this.getDataValue('price') || this.getDataValue('commodity_price');
      },
    },
  });

  Order.STATUS = {
    CREATED: 'CREATED',
    PAYED: 'PAYED',
    SHIPMENT: 'SHIPMENT',
    FINISHED: 'FINISHED',
  };

  return Order;
};