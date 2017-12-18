module.exports = (app) => {
  const {
    UUID,
    UUIDV1,
    STRING,
  } = app.Sequelize;

    /**
     * 商品类型Model
     *
     * @model BlessingCategory
     * @namespace Model
     * @property {uuid}   id
     * @property {string} name    - 类型名
     * @property {uuid}   cover   - 封面ID
     */
  const BlessingCategory = app.model.define('blessing_category', {
    id: {
      type: UUID,
      defaultValue: UUIDV1,
      primaryKey: true,
    },
    name: {
      type: STRING(20),
      allowNull: false,
    },
    cover_id: {
      type: UUID,
      allowNull: false,
    },
  });

  return BlessingCategory;
};

