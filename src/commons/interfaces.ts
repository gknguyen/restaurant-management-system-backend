import sequelize from 'sequelize';

export interface HTTPdata {
  code: number;
  message: string;
  data: any;
  transaction?: sequelize.Transaction;
  function: string;
}

export interface Payload {
  id: number;
  username: string;
  fullName: string;
  email: string;
  isActive: boolean;
  loginDateTime: Date | string;
  userTypeName: string;
}
