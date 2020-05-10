import debug from "debug";
import { Sequelize } from "sequelize";

const logger = debug("restaurant_management_system:server");
const uri =
  process.env.db_uri ||
  // "mysql://root:@localhost:3306/restaurant_management_system";
  // "mysql://ec2-user:@13.229.104.21:3306/restaurant_management_system";
  "mysql://admin:12345678@mysql-databases.cb9ydlohbhb0.ap-southeast-1.rds.amazonaws.com:3306/restaurant_management_system";

const sequelize = new Sequelize(uri, {
  logging: false,
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
});

sequelize
  .authenticate()
  .then(() => {
    logger("=> Connected to MySQL " + uri);
  })
  .catch((err: Error) => {
    return console.error("Unable to connect to the database:", err);
  });

export default sequelize;
