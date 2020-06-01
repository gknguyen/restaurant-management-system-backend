import { DataTypes, Model, BuildOptions, UUIDV4 } from 'sequelize';
import sequelize from '../../../configs/sequelize';
import { ProductTypeName } from '../../../commons/constants/enum-list';

export interface ProductType extends Model {
  readonly id: string;
  typeName: ProductTypeName;
  createUserId: string;
  createDateTime: Date;
  editUserId: string;
  editDateTime: Date;
}

let enums: any = ProductTypeName;
let keys: string[] = Object.keys(ProductTypeName);
const productTypeNameValues: string[] = [];
for (let i = 0; i < keys.length; i++) {
  let value: string = keys[i];
  productTypeNameValues.push(enums[value]);
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ProductType;
};

const productTypeModel = sequelize.define(
  'm_product_type',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    typeName: {
      type: DataTypes.ENUM,
      values: productTypeNameValues,
      allowNull: false,
      unique: true,
    },
    createUserId: {
      type: DataTypes.STRING,
    },
    editUserId: {
      type: DataTypes.STRING,
    },
  },
  {
    createdAt: 'createDateTime',
    updatedAt: 'editDateTime',
  },
) as ModelStatic;

export default productTypeModel;
