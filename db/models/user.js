'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // imageName:  {
    //   type: DataTypes.STRING,
    //   default: "none",
    //   allowNull: false,
    // },
    // imageData: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // },
    fav_movie: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Please enter a movie'
        },
        notEmpty: {
          msg: "movie cannot be empty"
        }
      }
    },
    fav_band: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Please enter a band'
        },
        notEmpty: {
          msg: "band cannot be empty"
        }
      }
    },
    fav_song: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Please enter a song'
        },
        notEmpty: {
          msg: "song cannot be empty"
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Please specify a gender'
        },
        notEmpty: {
          msg: "Gender can't be empty"
        }
      }
    },
    looking_for: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Please enter a gender'
        },
        notEmpty: {
          msg: "gender cannot be empty"
        }
      }
    },
    drinking: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Please enter a drink'
        },
        notEmpty: {
          msg: "drink cannot be empty"
        }
      }
    },
    education: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Please enter a education'
        },
        notEmpty: {
          msg: "education cannot be empty"
        }
      }
    },
    build: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Please enter a build'
        },
        notEmpty: {
          msg: "build cannot be empty"
        }
      }
    },
    living_status: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Please enter a living status'
        },
        notEmpty: {
          msg: "living status cannot be empty"
        }
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Please enter a age'
        },
        notEmpty: {
          msg: "age cannot be empty"
        }
      }
    },
    ideal_vaca: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Please enter a vacation'
        },
        notEmpty: {
          msg: "vacation cannot be empty"
        }
      }
    },
    fav_cheese: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Please enter a cheese'
        },
        notEmpty: {
          msg: "cheese cannot be empty"
        }
      }
    },
    fav_timeofday: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Please enter a time of day'
        },
        notEmpty: {
          msg: "time of day cannot be empty"
        }
      }
    },
    fav_mov_genre: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Please enter a movie genre'
        },
        notEmpty: {
          msg: "movie genre cannot be empty"
        }
      }
    },
    fav_weather: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Please enter a weather'
        },
        notEmpty: {
          msg: "weather cannot be empty"
        }
      }
    },
    fav_drink: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Please enter a drink'
        },
        notEmpty: {
          msg: "drink cannot be empty"
        }
      }
    },
    fav_cuisine: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: {
          msg: 'Please enter a cuisine'
        },
        notEmpty: {
          msg: "cuisine cannot be empty"
        }
      }
    },
    credId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    imgId: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
    {
      timestamps: false,
    // freezeTableName: true
  });
  User.associate = function(models) {
    User.belongsTo(models.Credential, {
      foreignKey: {
        fieldName: 'credId',
        allowNull: false,
      },
    });
    User.belongsTo(models.Images, {
      foreignKey: {
        fieldName: 'imgId',
        allowNull: false,
      },
    }); 
    User.hasMany(models.Messages, {
      foreignKey: {
        as: 'recipient',
        targetKey: 'recipientId',
        fieldName: 'recipientId',
        allowNull: true,
      },
    }); 
  };
  return User;
};