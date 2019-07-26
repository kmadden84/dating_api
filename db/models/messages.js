'use strict';
module.exports = (sequelize, DataTypes) => {
  const Messages = sequelize.define('Messages', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: true,
      primaryKey: true
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    senderId:  {
      type: DataTypes.STRING,
      default: "none",
     // allowNull: false,
    },
    recipientId: {
      type: DataTypes.STRING,
      default: "none",
      allowNull: false,
    }
  }, {
    //freezeTableName: true,
    //timestamps: false
  });
  Messages.associate = function (models) {
    Messages.belongsTo(models.User, {
      foreignKey: {
        as: 'receiver',
        fieldName: 'recipientId',
        targetKey: 'recipientId',
        allowNull: false
      }
  });
  Messages.belongsTo(models.Credential, {
    foreignKey: {
      as: 'sender',
      fieldName: 'senderId',
      targetKey: 'senderId',
      allowNull: false
    }
});
  };
  return Messages;
};