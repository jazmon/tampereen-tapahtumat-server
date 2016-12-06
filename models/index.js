const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dataloaderSequelize = require('dataloader-sequelize').default;

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';

const config = require('../config/config')[env];

const db = {};
let sequelize;
if (process.env.DATABASE_URL) {
  const match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    port: match[4],
    host: match[3],
    logging: true, // false
  });
  dataloaderSequelize(sequelize);
} else {
  sequelize = new Sequelize(config.database, config.username,
     config.password, config);
  dataloaderSequelize(sequelize);
}

fs.readdirSync(__dirname)
  .filter((file) =>
    (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    if (env === 'development') console.log(`Imported model ${model.name}`);
    db[model.name] = model;
  });

Object.keys(db)
  .forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
