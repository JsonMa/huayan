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

  // 微信支付
  exports.wechat = {
    appid: 'wx557ba9a6f91397ec', // 小程序appid
    mch_id: 1495285102, // 微信支付mchid
    trade_type: 'JSAPI',
    key: 'huayanxiaochengxu9090ERWEIMAHEKA', // 微信支付key
    secret: '9805b899521e50f413bf66cdd0484133', //小程序的 app secret
    grant_type: 'authorization_code', // token换取openid所需的
    openid_url: 'https://api.weixin.qq.com/sns/jscode2session', // openid获取地址
    unifiedorder_url: 'https://api.mch.weixin.qq.com/pay/unifiedorder', // 统一下单接口地址
  };

  // 腾讯云
  exports.tencent = {
    secretId: 'AKIDADg3IJmcw4xc6LrEnBNL3VheLlzwv3C4',
    secretKey: 'jHadQxGKCwRjkV1LPEsKXVM1RcYJtHTQ',
    notifyUrl: 'www.fs.com',
    fileType:  'mp4',
  }

  // 小程序api
  exports.miniProgram = {
    grantType: 'client_credential',
    tokenUrl: 'https://api.weixin.qq.com/cgi-bin/token',
    codeUrl: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit',
  }

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

  exports.host = 'https://buildupstep.cn';

  return exports;
};
