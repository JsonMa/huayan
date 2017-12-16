const co = require('co');
const Sequelize = require('sequelize');
const crypto = require('crypto');

const {
  UUID,
  UUIDV1,
  INTEGER,
  STRING,
  BOOLEAN,
  ENUM,
  ARRAY,
  DATE,
  FLOAT,
} = Sequelize;

const tables = {
  commodity_attr: {
    id: {
      type: UUID,
      defaultValue: UUIDV1,
      primaryKey: true,
    },
    name: {
      type: STRING(20),
      allowNull: false,
    },
    values: {
      type: ARRAY(STRING(20)),
      allowNull: false,
      defaultValue: [],
    },
    commodity_id: {
      type: UUID,
      allowNull: false,
    },
  },
  commodity_category: {
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
  },
  commodity: {
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
    description: STRING(500),
    price: {
      type: FLOAT,
      allowNull: false,
    },
    act_price: {
      type: FLOAT,
      allowNull: true,
    },
    sales: {
      type: INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    recommended: {
      type: BOOLEAN,
      defaultValue: false,
      allowNull: false,
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
    category_id: {
      type: UUID,
      allowNull: false,
    },
    picture_ids: {
      type: ARRAY(UUID),
      allowNull: false,
      defaultValue: [],
    },
  },
  file: {
    id: {
      type: UUID,
      defaultValue: UUIDV1,
      primaryKey: true,
    },
    name: {
      type: STRING(64),
      allowNull: false,
    },
    path: {
      type: STRING(128),
      allowNull: false,
    },
    type: {
      type: STRING(128),
      allowNull: false,
    },
    size: {
      type: INTEGER,
    },
  },
  banner: {
    id: {
      type: UUID,
      defaultValue: UUIDV1,
      primaryKey: true,
    },
    cover_id: {
      type: UUID,
      allowNull: false,
    },
    video_id: {
      type: UUID,
      allowNull: false,
    },
    status: {
      type: ENUM,
      values: [
        'ON',
        'OFF',
      ],
      defaultValue: 'OFF',
      allowNull: false,
    },
  },
  user: {
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
      allowNull: true,
    },
    contact: {
      type: STRING(20),
      allowNull: true,
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
  },
};

module.exports = {
  up: co.wrap(function* (queryInterface) {
    yield Promise.all(Object.keys(tables)
      .map(key => [key, Object.assign({}, tables[key], {
        deleted_at: DATE,
        updated_at: DATE,
        created_at: DATE,
      })]).map(([name, schema]) => queryInterface.createTable(name, schema)));

    // 插入管理员数据
    yield queryInterface.bulkInsert('user', [{
      name: 'admin',
      phone: '13896120331',
      password: crypto.createHash('md5').update('123456').digest('hex'),
      role: '1',
    }]);
  }),

  down: co.wrap(function* (queryInterface) {
    yield Promise.all(Object.keys(tables).map(key => queryInterface.dropTable(key)));
    yield queryInterface.bulkDelete('user', { phone: '13896120331' });
  }),
};
