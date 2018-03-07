
// had enabled by egg
exports.static = true;

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks',
};