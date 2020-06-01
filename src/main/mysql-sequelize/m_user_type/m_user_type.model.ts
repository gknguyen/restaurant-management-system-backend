import { BuildOptions, DataTypes, Model, UUIDV4 } from 'sequelize';
import { UserTypeName } from '../../../commons/constants/enum-list';
import sequelize from '../../../configs/sequelize';

export interface UserType extends Model {
  readonly id: string;
  typeName: UserTypeName;
  createUserId: string;
  createDateTime: Date;
  editUserid: string;
  editDateTime: Date;
}

let enums: any = UserTypeName;
let keys: string[] = Object.keys(UserTypeName);
const userTypeNameValues: string[] = [];
for (let i = 0; i < keys.length; i++) {
  let value: string = keys[i];
  userTypeNameValues.push(enums[value]);
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserType;
};

const userTypeModel = sequelize.define(
  'm_user_type',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    typeName: {
      type: DataTypes.ENUM,
      values: userTypeNameValues,
      allowNull: false,
      unique: true,
    },
    createUserId: {
      type: DataTypes.STRING,
    },
    editUserid: {
      type: DataTypes.STRING,
    },
  },
  {
    createdAt: 'createDateTime',
    updatedAt: 'editDateTime',
  },
) as ModelStatic;

export default userTypeModel;
