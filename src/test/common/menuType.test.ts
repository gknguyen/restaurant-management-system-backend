import chai from 'chai';
import chaiHttp from 'chai-http';
import STATUS_CODE from 'http-status';
import DB from '../../database/database.service';
import server from '../../server';
import MOCK from '../mock.data';

chai.use(chaiHttp);

describe('Automation test - common APIs', () => {
  let TOKEN: string;

  before((done) => {
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
        /** get JWT */
        TOKEN = res.body.token;
        done();
      });
  });

  describe('create menu type', () => {
    const data = {
      typeName: 'test',
    };

    let menuTypeId: number;

    it('create successfully', (done) => {
      chai
        .request(server)
        .post(MOCK.API.ROUTE.COMMON_MENU_TYPE)
        .set({ token: TOKEN })
        .send(data)
        .end((err, res) => {
          if (err) console.error(err);
          chai.assert.equal(res.status, STATUS_CODE.OK);
          chai.assert.equal(typeof res.body, 'object');
          menuTypeId = res.body.id;
          done();
        });
    });

    it('get list successfully', (done) => {
      chai
        .request(server)
        .get(MOCK.API.ROUTE.COMMON_MENU_TYPE)
        .set({ token: TOKEN })
        .end((err, res) => {
          if (err) console.error(err);
          chai.assert.equal(res.status, STATUS_CODE.OK);
          chai.assert.equal(typeof res.body, 'object');
          done();
        });
    });

    it('get one successfully', (done) => {
      chai
        .request(server)
        .get(`${MOCK.API.ROUTE.COMMON_MENU_TYPE}/${menuTypeId}`)
        .set({ token: TOKEN })
        .end((err, res) => {
          if (err) console.error(err);
          chai.assert.equal(res.status, STATUS_CODE.OK);
          chai.assert.equal(typeof res.body, 'object');
          done();
        });
    });

    after((done) => {
      DB.menuType
        .destroy({ where: { name: data.typeName } })
        .catch((err) => console.error(err))
        .finally(() => done());
    });
  });
});
