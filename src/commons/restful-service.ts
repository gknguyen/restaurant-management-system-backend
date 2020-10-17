import { Model, BuildOptions, Op } from 'sequelize';
import { RestfulService } from './constants/interfaces';

type AnyModel = typeof Model & {
  new (values?: object, options?: BuildOptions): any;
};

class RestService implements RestfulService {
  model: AnyModel;

  constructor(model: AnyModel) {
    this.model = model;
  }

  /** ================================================================================== */
  /**
  init table
  */
  getTableName() {
    return this.model.getTableName();
  }

  /** ================================================================================== */
  /**
  get 1 record
  */
  async getOne(condition: any) {
    return await this.model.findOne({ ...condition });
  }

  /**
  get many records
  */
  async getAll(condition: any) {
    return await this.model.findAll({ ...condition });
  }

  /** ================================================================================== */
  /**
  create 1 record
  */
  async postOne(data: any, condition: any) {
    return this.model.create({ ...data }, { ...condition });
  }

  /**
  create many records
  */
  async postAll(data: any[], condition: any) {
    return this.model.bulkCreate([...data], { ...condition });
  }

  /** ================================================================================== */
  /**
  edit 1 record
  */
  async putOne(data: any, condition: any) {
    return this.model.upsert({ ...data }, { ...condition });
  }

  /**
  edit many records
  */
  async putAll(data: any, condition: any) {
    return this.model.update({ ...data }, { ...condition });
  }

  /** ================================================================================== */
  /**
  delete 1 or many record
  */
  async delete(condition: any) {
    return this.model.destroy({ ...condition });
  }

  /* ================================================================================== */
  /*
  find or create
  */
  getOrPost(condition: any) {
    return this.model.findOrCreate({ ...condition });
  }

  /* ================================================================================== */
  /*
  create or edit
  */
  postOrPut(data: any, condition: any) {
    return this.model.upsert({ ...data }, { ...condition });
  }
}

export default RestService;
