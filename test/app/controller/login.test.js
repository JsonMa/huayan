const assert = require('assert');
const {
  app,
} = require('egg-mock/bootstrap');

describe('test/app/controller/login.test.js', () => {
  describe('user login', () => {
    it('app login', async function () {
      const phone = '13896120331';
      const password = '123456';
      const resp = await app.httpRequest()
        .post('/auth/login')
        .send({
          role: 'user',
          phone,
          password,
        })
        .expect(this.varifyResponse);
      assert.equal(phone, resp.body.data.user.phone);
      this.normalUser = resp.body.data;
    });

    it('pc login', async function () {
      const name = 'huayan-test-user';
      const password = '123456';
      const resp = await app.httpRequest()
        .post('/auth/login')
        .send({
          role: 'admin',
          name,
          password,
        })
        .expect(this.varifyResponse);
      assert.equal(name, resp.body.data.user.name);
      this.adminUser = resp.body.data;
    });

    it('user logout', async function () {
      await app.httpRequest()
        .get('/auth/logout')
        .set('access_token', this.adminUser.token)
        .expect(200);
    });
  });
});
