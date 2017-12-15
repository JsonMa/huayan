module.exports = (app) => {
  const {
    UUID,
    UUIDV1,
    STRING,
    INTEGER,
  } = app.Sequelize;

    /**
     * 贺卡Model
     *
     * @model Card
     * @namespace Model
     *
     * @property {uuid}    id
     * @property {number}  no             - 贺卡序列号
     * @property {uuid}    category_id    - 祝福语分类
     * @property {uuid}    content        - 祝福语内容
     */
  const Blessing = app.model.define('blessing', {
    id: {
      type: UUID,
      defaultValue: UUIDV1,
      primaryKey: true,
    },
    no: {
      type: INTEGER,
      autoIncrement: true,
    },
    category_id: {
      type: UUID,
      allowNull: false,
    },
    content: {
      type: STRING,
      allowNull: false,
    },
  });
  return Blessing;
};

