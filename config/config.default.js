// @ts-nocheck
module.exports = () => {
  const exports = {};

  exports.keys = 'huayan-server';

  exports.middleware = [
    'error',
    'auth',
  ];

  exports.auth = {
    prefix: 'prefix',
  };

  exports.formidable = {
    uploadDir: 'files',
    multiples: true,
  };

  exports.compress = {
    jpg_level: 'low', // low, medium, high, veryhigh
    png_level: 2, // 0-7
    png_quality: '65-80', // 0-100
    jpg_quality: 40, // 0-100
    output_dir: 'files',
  };

  exports.sequelize = {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'dbuser',
    password: 'root123456',
    database: 'huayan',
    benchmark: true,
    define: {
      freezeTableName: true,
      underscored: true,
      paranoid: true,
    },
  };

  exports.alipay = {
    secret: {
      type: 'RSA-SHA256',
      public: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw9ju1PnQEysiWxopYQbPIHiNRcbYwV2AYTz+WhRMVaTagmyGNYANmskjixQ+pKvvrl0KPa8CVX47h2AhUp3L2tSygh6C2bEpo7oaB77zZ84XmnUKotfwFUekUZUHjDhX91kVgun0LAIezWMDdRkZ9KC/0/8YnCfHUz9ecfYFd4fu17UlA9JJeEBQuyXDUzvdCtv7VEc9/KZ4sShyQoigaxG4HfRb8Iqmr+J2rARGwBAsjkH+bV609TVPTLCrpZT/rj0ua//1G7cv7Nhh2NcWK7nA2zksLvt/W9vLRYl7/3QXD96qUe2/vARzPp0L/QH3QtIv9NE87xVLmGk+TmxIAQIDAQAB',
      private: 'MIIEogIBAAKCAQEAw9ju1PnQEysiWxopYQbPIHiNRcbYwV2AYTz+WhRMVaTagmyGNYANmskjixQ+pKvvrl0KPa8CVX47h2AhUp3L2tSygh6C2bEpo7oaB77zZ84XmnUKotfwFUekUZUHjDhX91kVgun0LAIezWMDdRkZ9KC/0/8YnCfHUz9ecfYFd4fu17UlA9JJeEBQuyXDUzvdCtv7VEc9/KZ4sShyQoigaxG4HfRb8Iqmr+J2rARGwBAsjkH+bV609TVPTLCrpZT/rj0ua//1G7cv7Nhh2NcWK7nA2zksLvt/W9vLRYl7/3QXD96qUe2/vARzPp0L/QH3QtIv9NE87xVLmGk+TmxIAQIDAQABAoIBADok8Js4Y4cdWkDT3o8Y12ubfs3FgFrAKLo1won51sPigqEQGTRPBTr8FlpXM1XuWeVZaA3yJG4/YOsLJjmB8aDRXwH0jwKUb3lVah78mQUrkaRgtTytgXC/6U/zP99oZu1ffFx2mvBp3L07dS5Runv/MZR9+s95m9riSGbrFKpsorTtOIEd8Uck8O3ble/iB1G9hmX2qaMEqnppiY0gh7iTl5a9ji+TvZc+4Kfmv4jVKuQ1vGpVtDVNlgzq8RkuWxnm4UHFY2dZ1kU8gNBOImuVT4qfFAvpbBcyB69817kM8vh5/JBJEL+3JyJIvWq7v24T0w/Q1Fx7uqsH5Bb/9VUCgYEA8Mp2QkA99pZvehycabgHPfRdtMHcAqv1fLLHykKF4RPcKqhowKkBzSCFV5s0tOaMoGtkum6b5KDDibO7JDuZSG+MFgRGE3NOr/ixzN8kDfIPswmud8Ukkas/OVoBotH7IZsaPbgURJaMFXSFWBNv8OniqRds052PBbtsdiUJMAMCgYEA0De+kiiOHxt3w1VcygqsiJ5N2vPfo40Gv+4P+gbMfTKq35GpEQjoPMq8clqQm1CyJAgD7St0WaN0yxqOzBR0kwUJfyDQOFqsFIzlVapV7213wJYnttWhZ6Ywguadtn8haRAg1woPJh04zkqCOkEn5YJgppdzK+V9SNcFFR6jEqsCgYAPZfMgE3mi7kXcuj2qaRFVfe4MJCWMqjB9s/Ug0xY6qYl31OM2BtjNpFnCm3NIakHt9FAxt+cSPNGkWbELBSCtSCzeL5HHpqUOjcnY/yAQID2uxly43guToS7e3QmjvuffY0rPTZlGNZZpvNTWKBANiPdstsnH0piV1kF+YKnwvwKBgA9i/y831gDQe9IwfbHkhgl2gVRbzzv70PLf+chFNllOJDhvQColGVxcsv5UWPlRRkjJWtjs7CUvohLcPI8yN8chiSke2KRBdxPxsYTaGI2f7kiKEBc/xDSvoEgcGK2CyYpFCdg6QxJS+H6uHN+HLxaTwuasrHMi+1YlpZeA8xYPAoGAMOb9j0EHaVsAr2OyTSxfRho4ZfxZBlN05Q4NX3Fjl+eSBNzyJhz0+MxvSG9Dp6DSAnVJd5lpB8m3PYSHHyTqbq21VJm2+8TcysjQhhpFm3/KErGxLpgb9YFTPbsLGmOeSOL7QHHo3bczZe3NLJnzj55r1ITntoAsGpl3gQD5JS0=',
      ali: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsJLMw7HyJbTab9xBBw9jzw3F37obRwx4DVsZ0AihqcWJicUCLhPIyPmzC0A6f3FjoBcncn0a2w5neLBu0tpYm7qrFeY/QSy92WUzX6PmzFsotxxtq0SnWyMqfzlxkpSZPGoxxDB5vl40S8QEMceWH5ANzL+CT6VB8tNJ3ImCos2DeanjAiq5QBC/n2ZnCm8QUBAJ4hCTJwI850sSkwSETlHrtbVka4h02eY3Nmm120se5zhBc2MPaPMdDZWRiFeyXPWiFkijI4wXrEtSIwEWVECzqhnBuUHAq+0qfzvu+EejyTjGmp0u5+yJccDG6ES/LHFRjk54/9PbNngMEmxFMwIDAQAB',
    },
    app_id: '2015102700040153',
  };

  exports.wechat = {
    appid: 'wxd930ea5d5a258f4f',
    mch_id: 10000100,
    trade_type: 'APP',
    key: '192006250b4c09247ec02edce69f6a2d',
  };

  exports.redis = {
    client: {
      port: 6379,
      host: 'localhost',
      password: '',
      db: 0,
    },
  };

  exports.security = {
    csrf: {
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    },
  };

  exports.sentry = {
    enable: false,
    dsn: 'http://e58b5f1766c04e37994d5ae5d63e2d77:e4679e64196e4b44937586dd8565e495@172.19.3.185:9000/3',
  };

  exports.siteFile = {
    '/favicon.ico': '/static/favicon.ico',
  };

  exports.onerror = {
    html(err) {
      this.body = this.renderError(err);
      this.status = err.status;
    },
  };

  exports.notfound = {
    pageUrl: '/error',
  };

  // 安全配置中禁用csrf
  exports.security = {
    csrf: {
      enable: false,
    },
  };

  // 易联云配置
  exports.yLink = {
    // api url
    base: 'https://open-api.10ss.net',
    authorize: '/oauth/authorize',
    token: '/oauth/oauth',
    addMachineAuth: '/printer/addprinter',
    delMachineAuth: '/printer/deleteprinter',
    menuCreate: '/printmenu/addprintmenu',
    shutdownRestart: '/printer/shutdownrestart',
    printIndex: '/print/index',
    voice: '/printer/setsound',
    printInfo: '/printer/printinfo',
    version: '/printer/getversion',
    cancelAllPrint: '/printer/cancelall',
    cancelOnePrint: '/printer/cancelone',
    setLogo: '/printer/seticon',
    removeLogo: '/printer/deleteicon',
    order: '/printer/getorder',
    btnPrint: '/printer/btnprint',

    // 配置信息
    open: {
      redirect_uri: 'http://b2c3217a.ngrok.io/code', // 开放型应用才需要这个
      state: 'test', // 开放型应用才需要这个
    },
    personal: {
      machine_code: '4004528990', // 终端号，打印机底部标签上获取
      msign: 'uqtcahuk78nv', // 终端密钥，打印机底部标签上获取
    },
    type: 1, // 1 自有应用 2 开放应用
    client_id: '1052527659', // 应用ID
    api_key: '288ffb0e77e30f6b17ea518f3ee4cea2', // 应用秘钥
  };

  return exports;
};
