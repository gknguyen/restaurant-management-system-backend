export default interface RestfulService {
  postOne(data: any, condition: any): any;
  postAll(data: any, condition: any): any;

  putOne(data: any, condition: any): any;
  putAll(data: any, condition: any): any;

  getOne(condition: any): any;
  getAll(condition: any): any;

  delete(condition: any): any;
}
