const _ = require('lodash');
const assert = require('assert');
const uuidv4 = require('uuid/v4');
const crypto = require('crypto');
const Promise = require('bluebird');

/**
 *
 * 初始化model, 并注入其依赖项
 *
 * @class Initiater
 */
module.exports = class Initiater {
  /**
   * Creates an instance of Initiater.
   * @memberof Initiater
   *
   * @param {App} app - Egg Application
   */
  constructor(app) {
    this.app = app;
    this.values = {};
    this.adminId = '1';
  }

  /**
   * 删除injected的models
   *
   * @returns {Promise} 任务
   */
  destory() {
    const values = _.assign(this.values);
    this.values = {};
    return Promise.all(Object.keys(values)
      .map(key => this.app.model[_.upperFirst(_.camelCase(key))]
        .destroy({
          where: {
            id: {
              $in: values[key].map(item => item.id),
            },
          },
          force: true,
        })));
  }

  /**
   * 注入models
   *
   * @param {any} [models=['order', 'address', 'commodity', 'commodity_category', 'post',
   * 'post_category', 'post_comment', 'post_hits', 'post_vote', 'sensitive_word', 'file']]
   * - 需要初始化的model
   * @memberof Initiater
   * @returns {Promise} 注入model的Map, Promise<Map>
   */
  inject(models) {
    return this._injectDependences(['user', ...models]);
  }

  /**
   *
   *
   * @param {any} [models=['order', 'address', 'commodity', 'commodity_category', 'post',
   * 'post_category', 'post_comment', 'post_hits', 'post_vote', 'sensitive_word', 'file']]
   * - 需要初始化的model
   * @memberof Initiater
   * @returns {Promise} 注入model的Map, Promise<Map>
   */
  _injectDependences(models = []) {
    return Promise.mapSeries(models, async (key) => {
      if (this.values[key]) return;
      const value = await this[`_inject${_.upperFirst(_.camelCase(key))}`]();
      assert(_.isArray(value), 'value must be format of array!');
      this.values[key] = value;
    });
  }

  /**
   *
   *
   * @param {any} model       - 需要获取的model
   * @param {any} [limit={}]  - 需要匹配的条件，key-value
   * @returns {Promise} 匹配的model
   * @memberof Initiater
   */
  _getRandomItem(model, limit = {}) {
    const target = this.values[model];
    assert(target, `dependences '${model}' are required !`);

    if (_.isArray(target)) {
      const arr = target.slice();
      if (!limit) {
        return _.sample(arr);
      }
      while (arr) {
        const item = arr.pop();
        if (_.isMatch(item, limit)) {
          return item;
        }
      }
      assert(false, `can not find injected model of ${model}`);
    }

    return assert(false, 'unsupport type of model!');
  }

  /**
   * 注入user
   *
   * @returns {Promise} 已注入的users, Promise<Array<User>>
   * @memberof Initiater
   */
  _injectUser() {
    const md5 = crypto.createHash('md5');
    const password = md5.update('123456').digest('hex');
    return this.app.model.User.bulkCreate([{
      name: 'huayan-test-user',
      phone: '13896120331',
      password,
    }]);
  }

  /**
   * 注入orders及其依赖model
   *
   * @returns {Promise} 已注入的orders, Promise<Array<Order>>
   * @memberof Initiater
   */
  // _injectOrder() {
  //   return this._injectDependences(['commodity', 'address']).then(() => {
  //     const commodityId = this._getRandomItem('commodity').id;
  //     // inject orders ...
  //     return this.app.model.Order.bulkCreate([{
  //       status: 'CREATED',
  //       user_id: this.userId,
  //       no: '123123123',
  //       commodity_id: commodityId,
  //       address_id: this._getRandomItem('address').id,
  //       commodity_price: 1.0,
  //     },
  //     {
  //       status: 'PAYED',
  //       user_id: this.userId,
  //       no: '123123234',
  //       commodity_id: commodityId,
  //       address_id: this._getRandomItem('address').id,
  //       commodity_price: 1,
  //     },
  //     {
  //       status: 'SHIPMENT',
  //       user_id: this.userId,
  //       no: '123123456',
  //       commodity_id: commodityId,
  //       address_id: this._getRandomItem('address').id,
  //       commodity_price: 1,
  //     },
  //     {
  //       status: 'FINISHED',
  //       user_id: this.userId,
  //       no: '123123567',
  //       commodity_id: commodityId,
  //       address_id: this._getRandomItem('address').id,
  //       commodity_price: 1,
  //     },
  //     ]);
  //   });
  // }

  /**
   * 注入trades及其依赖model
   *
   * @returns {Promise} 已注入的traders, Promise<Array<Trade>>
   * @memberof Initiater
   */
  // _injectTrade() {
  //   return this._injectDependences(['order']).then(() => {
  //     const orderId = this._getRandomItem('order', { status: 'PAYED' }).id;
  //     return this.app.model.Trade.bulkCreate([
  //       { status: 'PENDING', type: 'ALIPAY', order_id: orderId },
  //       { status: 'CLOSED', type: 'ALIPAY', order_id: orderId },
  //       { status: 'SUCCESS', type: 'ALIPAY', order_id: orderId },
  //     ]);
  //   });
  // }

  /**
   * 注入logistics及其依赖model
   *
   * @returns {Promise} 已注入的traders, Promise<Array<Trade>>
   * @memberof Initiater
   */
  // _injectLogistics() {
  //   return this._injectDependences(['order']).then(() => {
  //     const orderId = this._getRandomItem('order', { status: 'PAYED' }).id;
  //     return this.app.model.Logistics.bulkCreate([
  //       {
  //         order_id: orderId,
  //         company: 'company',
  //         order_no: '123123123',
  //       },
  //     ]);
  //   });
  // }

  /**
   * 注入addresses及其依赖model
   *
   * @returns {Promise} 已注入的addresses, Promise<Array<Address>>
   * @memberof Initiater
   */
  // _injectAddress() {
  //   return this.app.model.Address.bulkCreate([{
  //     user_id: this.userId,
  //     name: 'shubang-test1',
  //     phone: '13000000001',
  //     location: '重庆互联网产业园1栋',
  //     default: true,
  //   },
  //   {
  //     user_id: this.userId,
  //     name: 'shubang-test2',
  //     phone: '13000000002',
  //     location: '重庆互联网产业园2栋',
  //   },
  //   ]);
  // }

  /**
   * 注入commodity及其依赖model
   *
   * @returns {Promise} 已注入的commodities, Promise<Array<Commodity>>
   * @memberof Initiater
   */
  _injectCommodity() {
    return this._injectDependences(['commodity_category']).then(() =>
      // inject commodities ...
      this.app.model.Commodity.bulkCreate([{
        name: '二维码',
        price: 1,
        act_price: 0.6,
        sales: 0,
        recommended: true,
        status: 'ON',
        category_id: this._getRandomItem('commodity_category').id,
      },
      {
        name: '二维码纸张',
        price: 1000,
        act_price: 1000,
        sales: 0,
        recommended: true,
        status: 'OFF',
        category_id: this._getRandomItem('commodity_category').id,
      },
      {
        name: '二维码打印机',
        price: 1000,
        act_price: 1000,
        sales: 0,
        recommended: true,
        status: 'OFF',
        category_id: this._getRandomItem('commodity_category').id,
      },
      {
        name: '打印机电池',
        price: 1000,
        act_price: 1000,
        sales: 0,
        recommended: true,
        status: 'OFF',
        category_id: this._getRandomItem('commodity_category').id,
      },
      {
        name: '打印机电源适配器',
        price: 1000,
        act_price: 1000,
        sales: 0,
        recommended: true,
        status: 'OFF',
        category_id: this._getRandomItem('commodity_category').id,
      },
      ]));
  }

  /**
   * 注入commodity_category及其依赖model
   *
   * @returns {Promise} 已注入的commodity_categories, Promise<Array<CommodityCategory>>
   * @memberof Initiater
   */
  _injectCommodityCategory() {
    return this._injectDependences(['file']).then(() =>
      // inject commodity_category ...
      this.app.model.CommodityCategory.bulkCreate([{
        name: '二维码',
        cover_id: this._getRandomItem('file').id,
      },
      {
        name: '配件',
        cover_id: this._getRandomItem('file').id,
      },
      ]));
  }

  /**
   * 注入sensitive_word及其依赖model
   *
   * @returns {Promise} 已注入的sensitive_words, Promise<Array<SensitiveWord>>
   * @memberof Initiater
   */
  // _injectSensitiveWord() {
  //   // inject sensitive_word ...
  //   return this.app.model.SensitiveWord.bulkCreate([{
  //     key: '电动车',
  //   },
  //   {
  //     key: '三轮车',
  //   },
  //   ]);
  // }

  /**
   * 注入post_category及其依赖model
   *
   * @returns {Promise} 已注入的post_categories, Promise<Array<PostCategory>>
   * @memberof Initiater
   */
  // _injectPostCategory() {
  //   return this._injectDependences(['file']).then(() =>
  //     // inject post_category ...
  //     this.app.model.PostCategory.bulkCreate([{
  //       name: '电动车',
  //       cover_id: this._getRandomItem('file').id,
  //     },
  //     {
  //       name: '快递员',
  //       cover_id: this._getRandomItem('file').id,
  //     },
  //     ]));
  // }

  /**
   * 注入post及其依赖model
   *
   * @returns {Promise} 已注入的post, Promise<Array<Post>>
   * @memberof Initiater
   */
  // _injectPost() {
  //   return this._injectDependences(['post_category', 'sensitive_word', 'file']).then(() =>
  //     // inject post ...
  //     this.app.model.Post.bulkCreate([{
  //       theme: 'post1',
  //       theme_filted: 'post1',
  //       user_id: 6,
  //       content: '我骑的电动车不是三轮车',
  //       content_filted: '|我骑的电动车不是三轮车',
  //       cover_id: this._getRandomItem('file').id,
  //       category_id: this._getRandomItem('post_category').id,
  //       sensitive_words: [this._getRandomItem('sensitive_word').id, this._getRandomItem('sensitive_word').id],
  //     },
  //     {
  //       theme: 'post2',
  //       theme_filted: 'post2',
  //       user_id: this.userId,
  //       content: '我是一个小小小快递员',
  //       content_filted: '我是一个小小小快递员',
  //       cover_id: this._getRandomItem('file').id,
  //       category_id: this._getRandomItem('post_category').id,
  //       sensitive_words: [],
  //     },
  //     ]));
  // }

  /**
   * 注入post_comments及其依赖model
   *
   * @returns {Promise} 已注入的post_comments, Promise<Array<PostComment>>
   * @memberof Initiater
   */
  // _injectPostComment() {
  //   return this._injectDependences(['post']).then(() =>
  //     // inject post_comment ...
  //     this.app.model.PostComment.bulkCreate([{
  //       user_id: 2,
  //       content: 'shubang-post-comment1-三轮车',
  //       content_filted: 'shubang-post-comment1',
  //       post_id: this._getRandomItem('post', { theme: 'post2' }).id,
  //     },
  //     {
  //       user_id: this.userId,
  //       content: 'shubang-post-comment1-电动车',
  //       content_filted: 'shubang-post-comment1',
  //       post_id: this._getRandomItem('post', { theme: 'post2' }).id,
  //     },
  //     ]));
  // }

  /**
   * 注入post_vote及其依赖model
   *
   * @returns {Promise} 已注入的post_vote, Promise<Array<PostVote>>
   * @memberof Initiater
   */
  // _injectPostVote() {
  //   return this._injectDependences(['post']).then(() =>
  //     // inject post_vote ...
  //     this.app.model.PostVote.bulkCreate([{
  //       user_id: 2,
  //       post_id: this._getRandomItem('post', { theme: 'post2' }).id,
  //     },
  //     {
  //       user_id: this.userId,
  //       post_id: this._getRandomItem('post', { theme: 'post2' }).id,
  //     },
  //     ]));
  // }

  /**
   * 注入post_hits及其依赖model
   *
   * @returns {Promise} 已注入的post_hits, Promise<Array<PostHits>>
   * @memberof Initiater
   */
  // _injectPostHits() {
  //   return this._injectDependences(['post'])
  //     .then(() =>
  //       // inject post_hits ...
  //       this.app.model.PostHits.bulkCreate([{
  //         session_id: uuidv4(),
  //       },
  //       {
  //         session_id: uuidv4(),
  //       },
  //       ]))
  //     .then(async (hits) => {
  //       await this._getRandomItem('post', { theme: 'post2' }).addPost_hits(hits);
  //       const dbHits = await this.app.model.PostHits.findAll({
  //         where: { id: { $in: hits.map(h => h.id) } },
  //       });
  //       return dbHits;
  //     });
  // }

  /**
   * 注入files及其依赖model
   *
   * @returns {Promise} 已注入的files, Promise<Array<File>>
   * @memberof Initiater
   */
  _injectFile() {
    // inject files ...
    return this.app.model.File.bulkCreate([{
      name: 'file1',
      path: 'file://mock-file1',
      type: 'image/png',
      size: 1024,
    },
    {
      name: 'file2',
      path: 'file://mock-file2',
      type: 'image/png',
      size: 1024,
    },
    ]);
  }

  /**
   * 注入commodity attribute及其依赖model
   *
   * @returns {Promise} 已注入的commodity attribute, Promise<Array<CommodityAttribute>>
   * @memberof Initiater
   */
  _injectCommodityAttr() {
    return this._injectDependences(['commodity'])
      .then(() => {
        const commodity = this._getRandomItem('commodity');
        // inject commodity ...
        return this.app.model.CommodityAttr.bulkCreate([{
          commodity_id: commodity.id,
          name: 'MOCK-ATTRIBUTE',
          values: ['MOCK-ATTRIBUTE-VALUE', 'MOCK-ATTRIBUTE-VALUE2'],
        },
        {
          commodity_id: commodity.id,
          name: 'MOCK-ATTRIBUTE2',
          values: ['MOCK-ATTRIBUTE-VALUE', 'MOCK-ATTRIBUTE-VALUE2'],
        },
        ]);
      });
  }
  /**
   * 注入banner及其依赖model
   *
   * @returns {Promise} 已注入的banner, Promise<Array<Banner>>
   * @memberof Initiater
   */
  _injectBanner() {
    return this._injectDependences(['file']).then(() =>
    // inject file ...
      this.app.model.Banner.bulkCreate([{
        picture_id: this.values.file[0].id,
      },
      {
        picture_id: this.values.file[1].id,
      },
      ]));
  }
};
