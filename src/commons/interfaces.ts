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
