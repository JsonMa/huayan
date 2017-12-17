exports.sequelize = {
  username: 'postgres',
  password: '123456',
  database: 'huayan',
  host: 'localhost',
};

exports.redis = {
  client: {
    port: 6379,
    host: 'localhost',
    password: '',
    db: 0,
  },
};

exports.noPrefix = true;

exports.middleware = [];
