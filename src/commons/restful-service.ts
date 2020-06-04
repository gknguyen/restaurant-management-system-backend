import { Model, BuildOptions, Op } from 'sequelize';
import RestfulService from './restful';

type AnyModel = typeof Model & {
  new (values?: object, options?: BuildOptions): any;
};

class RestService implements RestfulService {
  model: AnyModel;

  constructor(model: AnyModel) {
    this.model = model;
  }

  /* ================================================================================== */
  /* 
  post 1 record 
  */
  async postOne(data: any, condition: any) {
    return this.model.create({ ...data }, { ...condition });
  }

  /* 
  post many records 
  */
  async postAll(data: any[], condition: any) {
    return this.model.bulkCreate([...data], { ...condition });
  }

  /* ================================================================================== */
  /*
  put 1 record
  */
  async putOne(data: any, condition: any) {
    return this.model.upsert({ ...data }, { ...condition });
  }

  /*
  put 1 record
  */
  async putAll(data: any, condition: any) {
    return this.model.update({ ...data }, { ...condition });
  }

  /* ================================================================================== */
  /* 
  get 1 record 
  */
  async getOne(condition: any) {
    return await this.model.findOne({ ...condition });
  }

  /* 
  get many records 
  */
  async getAll(condition: any) {
    return await this.model.findAll({ ...condition });
  }

  /* ================================================================================== */
  /* 
  delete 1 or many record 
  */
  async delete(condition: any) {
    return this.model.destroy({ ...condition });
  }
}

export default RestService;
