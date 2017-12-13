module.exports = (app) => {
  const { formidable, compress } = app.middleware;

  /* istanbul ignore next */
  const prefix = app.config.noPrefix ? '' : '/api/v2';

  // auth
  app.post(`${prefix}/auth/login`, 'auth.login');
  app.get(`${prefix}/auth/logout`, 'auth.logout');

  // commodity
  app.get(`${prefix}/commodities`, 'commodity.index');
  app.get(`${prefix}/commodities/:id`, 'commodity.show');
  app.post(`${prefix}/commodities`, 'commodity.create');
  app.delete(`${prefix}/commodities`, 'commodity.batchDestroy');
  app.patch(`${prefix}/commodities`, 'commodity.batchUpdate');
  app.patch(`${prefix}/commodities/:id`, 'commodity.update');
  app.post(`${prefix}/commodities/:id/attributes`, 'commodity.createAttribute');
  app.get(`${prefix}/commodities/:id/attributes`, 'commodity.attributeIndex');
  app.get(`${prefix}/commodities/:id/attributes/:attr_id`, 'commodity.attributeShow');
  app.put(`${prefix}/commodities/:id/attributes/:attr_id`, 'commodity.attributeUpdate');
  app.delete(`${prefix}/commodities/:id/attributes/:attr_id`, 'commodity.destoryAttribute');

  // commodity category
  app.get(`${prefix}/commodity_categories`, 'commodityCategory.index');
  app.post(`${prefix}/commodity_categories`, 'commodityCategory.create');
  app.delete(`${prefix}/commodity_categories`, 'commodityCategory.batchDestroy');
  app.patch(`${prefix}/commodity_categories/:id`, 'commodityCategory.update');

  // file
  app.get(`${prefix}/files/:id`, 'file.show');
  app.post(`${prefix}/files`, formidable(app.config.formidable), compress(), 'file.upload');

  // banner
  app.get(`${prefix}/banners`, 'banner.index');
  app.post(`${prefix}/banners`, 'banner.create');
  app.patch(`${prefix}/banners/:id`, 'banner.update');
  app.delete(`${prefix}/banners/:id`, 'banner.destroy');

  // error
  app.get('/error', 'error.index');
};
