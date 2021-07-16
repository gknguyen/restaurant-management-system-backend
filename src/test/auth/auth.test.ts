import chai from 'chai';
import chaiHttp from 'chai-http';
import STATUS_CODE from 'http-status';
import server from '../../server';
import MOCK from '../mock.data';

chai.use(chaiHttp);

describe('Automation test - authentication APIs', () => {
  describe('login feature', () => {
    it('login successfully', (done) => {
      const loginUser = {
        username: 'admin',
        password: 'admin',
      };
      chai
        .request(server)
        .post(MOCK.API.ROUTE.LOGIN)
        .send(loginUser)
        .end((err, res) => {
          if (err) console.error(err);
          chai.assert.equal(res.status, STATUS_CODE.OK);
          chai.assert.equal(typeof res.body, 'object');
          chai.assert.equal(typeof res.body.token, 'string');
          done();
        });
    });
  });
});
