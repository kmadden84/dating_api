'use strict';
module.exports = (sequelize, DataTypes) => {
  const Images = sequelize.define('Images', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: true,
      primaryKey: true,

    },
    imageName:  {
      type: DataTypes.STRING,
      default: "none",
      allowNull: false,
    },
    imageData: {
      type: DataTypes.STRING,
      allowNull: false
    }
    // imgId:  {
    //   type: DataTypes.STRING,
    //   default: "none",
    //  // allowNull: false,
    // }
  }, {
    //freezeTableName: true,
    //timestamps: false
  });
  Images.associate = function (models) {
    Images.hasOne(models.User, {
      foreignKey: {
        as: 'imgId',
        fieldName: 'imgId',
        allowNull: false,
        constraints: false
      }
  });
  };
  return Images;
};