'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);

const models = {};

const options = {
  dialect: 'sqlite',
  storage: 'dating_api.db',
  operatorsAliases: false,
  sync: { force: false,
   alter: false
   },
   retry: {
    max: 10
  }
  // define: {
  //   timestamps: false,
  // },
};

const sequelize = new Sequelize(options);


sequelize
    .authenticate()
    .then(() => {
      console.log('Synchronizing the models with the database...');
//return sequelize.sync({force:false,alter:true});
    })
    .then(function(err) {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
});



fs
  .readdirSync(path.join(__dirname, 'models'))
  .forEach((file) => {
    console.info(`Importing database model from file: ${file}`);
    const model = sequelize.import(path.join(__dirname, 'models', file));
    models[model.name] = model;
  });

// If available, call method to create associations.
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    console.info(`Configuring the associations for the ${modelName} model...`);
    models[modelName].associate(models);
  }
});


module.exports = {
  sequelize,
  Sequelize,
  models,
};