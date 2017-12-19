const qs = require('querystring');
const time = require('moment')().format('X');
const uuid = require('uuid/v4');
const crypto = require('crypto');
const { yLink } = require('../../../config/config.default')();

module.exports = {
  singnature(timestamp) {
    const sign = yLink.ak + timestamp + yLink.sk;
    return crypto.createHash('md5').digest(sign);
  },

  genSign(data) {
    const obj = {
      scope: 'all',
      sign: this.singnature(time),
      id: uuid(),
      timestamp: time,
    };
    return qs.stringify({ ...obj, ...data });
  },
};
