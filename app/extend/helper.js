const validateRule = require('./helper/rule');

module.exports = {
  rule: validateRule,
  ajv: require('./helper/ajv'),
  preprocessor: require('./helper/preprocessor'),
  assert: require('assert'),
  printer: require('./helper/printer'),
  video: require('./helper/video'),
  uuidValidate: uuid => new RegExp(validateRule.uuidRegrex).test(uuid),
};
