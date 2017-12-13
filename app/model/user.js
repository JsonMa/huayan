module.exports = (app) => {
  const {
    UUID,
    UUIDV1,
    STRING,
    INTEGER,
    ENUM,
    ARRAY,
  } = app.Sequelize;

    /**
     * 用户Model
     *
     * @model User
     * @namespace Model
     *
     * @property {uuid}    id
     * @property {number}  no             - 商家序列号
     * @property {string}  name           - 商家名
     * @property {string}  address        - 商家地址
     * @property {string}  phone          - 联系人
     * @property {uuid}    avatar_id      - 商家logo id
     * @property {array}   picture_ids    - 产品图ids
     * @property {string}  url            - 公众号url地址
     * @property {enum}    status         - 商家状态['ON', 'OFF']
     * @property {enum}    role           - 用户角色[1,2]分别代表系统管理员、商家
     * @property {string}  password       - 密码,md5加密后的值
     */
  const User = app.model.define('user', {
    id: {
      type: UUID,
      defaultValue: UUIDV1,
      primaryKey: true,
    },
    no: {
      type: INTEGER,
      autoIncrement: true,
    },
    name: {
      type: STRING(20),
      allowNull: false,
    },
    address: {
      type: STRING(32),
      allowNull: true,
    },
    phone: {
      type: STRING(32),
      allowNull: false,
    },
    password: {
      type: STRING(64),
      allowNull: false,
    },
    avatar_id: {
      type: UUID,
      allowNull: true,
    },
    picture_ids: {
      type: ARRAY(UUID),
      allowNull: false,
      defaultValue: [],
    },
    url: {
      type: UUID,
      allowNull: true,
    },
    status: {
      type: ENUM,
      values: [
        'ON',
        'OFF',
      ],
      defaultValue: 'ON',
      allowNull: false,
    },
    role: {
      type: ENUM,
      values: [
        '1',
        '2',
      ],
      defaultValue: '2',
      allowNull: false,
    },
  });
  return User;
};

