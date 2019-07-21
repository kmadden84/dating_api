

'use strict';

const bcryptjs = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const Credential = sequelize.define('Credential', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Please enter a first name'
        },
        notEmpty: {
          msg: "title cannot be empty"
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Please enter a last name'
        },
        notEmpty: {
          msg: "title cannot be empty"
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail : {
          args: true,
          msg: "Must enter a valid email"
        },
        notNull: {
          msg: 'Please enter email'
        },
        isUnique: function (value, next) {
          var self = this;
          Credential.findOne({ where: { username: value } })
            .then(function (user) {
              // reject if a different user wants to use the same email
              if (user && self.id !== user.id) {
                return next('Email already in use!');
              }
              return next();
            })
            .catch(function (err) {
              return next(err);
            });
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter your password'
        }
      }
    },
  }, {
    //timestamps: false,
   //freezeTableName: true,
    hooks: {
      beforeCreate: async function (user) {
        const salt = await bcryptjs.genSalt(10); 
        user.password = await bcryptjs.hash(user.password, salt);
      }
    },
    instanceMethods: {
      validPassword: function (password) {
        return bcryptjs.compareSync(password, this.password);
      }
    }
  });
  Credential.associate = function(models) { 
    Credential.hasOne(models.User, {
      foreignKey: {
        fieldName: 'credId',
        allowNull: false,
      },
  });
  };
  return Credential;
};