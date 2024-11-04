const { Sequelize } = require('sequelize');
const {
    DB_USER,
    DB_HOST,
    DB_PORT,
    DB_NAME
  } = process.env;
  
class Db {
    constructor() {
        const sequelize = new Sequelize(DB_NAME, DB_USER,{
            host: DB_HOST,
            dialect: 'postgres',
            // dialectModule: pg,
            port: DB_PORT,
            logging: false, //false不顯示log
          });
          this.sequelize = sequelize;

          this.Sequelize = Sequelize;
          this.Op = Sequelize.Op;
    }

}
module.exports = Db;


