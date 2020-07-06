export interface RestfulService {
  postOne(data: any, condition: any): any;
  postAll(data: any, condition: any): any;

  putOne(data: any, condition: any): any;
  putAll(data: any, condition: any): any;

  getOne(condition: any): any;
  getAll(condition: any): any;

  delete(condition: any): any;
}

export interface Results {
  code: number;
  message: string;
  values: any;
}

export interface Payload {
  id: string;
  username: string;
  fullName: string;
  email: string;
  activeStatus: boolean;
  loginDateTime: Date;
  userTypeName: string;
}
