'use strict';

const express = require('express');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const { sequelize, models } = require('../db');
const Sequelize = require('sequelize');
const { Credential, User, Images } = models;
const router = express.Router();
const authUser = require('./authenticate.js');
const Op = Sequelize.Op;

const multer = require('multer');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 0.5
  },
  fileFilter: fileFilter
})

router.get('/search', function (req, res, next) {
  const movie = req.query.movie;
  const band = req.query.band;
  const song = req.query.song;
  const vaca = req.query.vaca;
  const seeking = req.query.seeking;
  const drinking = req.query.drinking;
  const education = req.query.education;
  const build = req.query.build;
  const living_status = req.query.living;
  const age = req.query.age;
  const cheese = req.query.cheese;
  const timeofday = req.query.timeofday;
  const movgenre = req.query.movgenre;
  const weather = req.query.weather;
  const favdrink = req.query.favdrink;
  const cuisine = req.query.cuisine;
  const gender = req.query.gender;
const id = req.body.id;
  //let page = req.params.page;
  //const limit = 50;
  // let offset = limit * (page - 1);


  User.findAndCountAll({
    where: {
      [Op.and]: [
        {
          gender: {
            [Op.eq]: seeking
          }
        }
      ], 
      [Op.and]: [
        {
          fav_movie: {
            [Op.like]: '%' + movie + '%'
          }
        }, {
          fav_band: {
            [Op.like]: '%' + band + '%'
          }
        },
        {
          fav_song: {
            [Op.like]: '%' + song + '%'
          }
        }, {
          drinking: {
            [Op.like]: '%' + drinking + '%'
          }
        }, {
          education: {
            [Op.like]: '%' + education + '%'
          }
        }, {
          build: {
            [Op.like]: '%' + build + '%'
          }
        }, {
          living_status: {
            [Op.like]: '%' + living_status + '%'
          }
        }, {
          age: {
            [Op.like]: '%' + age + '%'
          }
        }, {
          ideal_vaca: {
            [Op.like]: '%' + vaca + '%'
          }
        }, {
          fav_cheese: {
            [Op.like]: '%' + cheese + '%'
          }
        }, {
          fav_timeofday: {
            [Op.like]: '%' + timeofday + '%'
          }
        }, {
          fav_mov_genre: {
            [Op.like]: '%' + movgenre + '%'
          }
        }, {
          fav_weather: {
            [Op.like]: '%' + weather + '%'
          }
        }, {
          fav_drink: {
            [Op.like]: '%' + favdrink + '%'
          }
        }, {
          fav_cuisine: {
            [Op.like]: '%' + cuisine + '%'
          }
        }
      ]
    },

    order: [
      ['fav_song', 'asc'],
      ['ideal_vaca', 'asc'],
      ['fav_band', 'asc'],
      ['fav_movie', 'asc'],
      ['drinking', 'asc'],
      ['education', 'asc'],
      ['living_status', 'asc'],
      ['fav_cheese', 'asc'],
      ['fav_timeofday', 'asc'],
      ['fav_weather', 'asc'],
      ['fav_drink', 'asc'],
      ['fav_cuisine', 'asc']
   ],

//     order: [
//  [sequelize.literal('fav_movie', 'fav_band', 'fav_song', 'looking_for', 'drinking', 'education', 'build', 'living_status', 'age', 'ideal_vaca',' fav_cheese', 'fav_timeofday', 'fav_mov_genre', 'fav_weather', 'fav_drink', 'fav_cuisine'), 'DESC'],
//  // [sequelize.literal('fav_movie, fav_band, fav_song, looking_for, drinking, education, build, living_status, age, ideal_vaca, fav_cheese, fav_timeofday, fav_mov_genre, fav_weather, fav_drink, fav_cuisine'), 'asc']],
//     ],
    include: [
      {
        model: Credential,
      // as: 'credId'
      },
      {
        model: Images,
      // as: 'credId'
      }
    ]


  }).then(function (users) {
    //  let pages = Math.ceil(catalog.count / limit);
    return res.status(200).json({ results: users });
  })
    .catch(function (err) {
      //res.send(500, err);
      res.status(200).json({ results: err });
    });
});

router.post('/image', authUser.authenticateUser, upload.single('imageData'), function (req, res) {
  const credentials = auth(req);
  Credential.findOne({
    where: {
      username: credentials.name
    }
  }).then(function (cred) {
    console.log(req.file.path)
    Images.create({
      imageName: req.body.imageName,
      imageData: req.file.path,
      imageId: cred.id
    })
    }).then(async function (user) {
      console.log('image added')
      return res.location('/').status(200).json({ 'Message': 'Image Uploaded' });
    }).catch(function (err) {
      if (err.name === "SequelizeValidationError") {
        console.log(err)
        return res.status(400).json({ 'Error': err.message });
      } else {
        throw err;
      }
    }).catch(function (err) {
      res.json({ 'Error': err });
    });
  });    

router.post('/', authUser.authenticateUser, function (req, res) {
  const credentials = auth(req);
  Credential.findOne({
    where: {
      username: credentials.name
    }
  }).then(function (cred) {
    User.create(req.body)
      .then(function (user) {
        console.log('User Added');
        return res.location('/').sendStatus(200).json({ 'Message': 'Details Updated' }).end();
      }).catch(function (err) {
        if (err.name === "SequelizeValidationError") {
          console.log(err)
          return res.status(400).json({ 'Error': err.message });
        } else {
          throw err;
        }
      }).catch(function (err) {
        console.log(err);
        res.send(500);
      });
  });
});

router.get('/image', authUser.authenticateUser, upload.single('imageData'), function (req, res) {
  const credentials = auth(req);
  Credential.findOne({
    where: {
      username: credentials.name
    }
  }).then(function (cred) {
    Images.findByPk(cred.id).then(function (img) {
      console.log('image added')
      return res.location('/').status(200).json({ results: img });
    }).catch(function (err) {
      if (err.name === "SequelizeValidationError") {
        console.log(err)
        return res.status(400).json({ 'Error': err.message });
      } else {
        throw err;
      }
    }).catch(function (err) {
      res.json({ 'Error': err });
    });
  });   
});   

router.put('/image', authUser.authenticateUser, upload.single('imageData'), function (req, res) {
  const credentials = auth(req);
  Credential.findOne({
    where: {
      username: credentials.name
    }
  }).then(function (cred) {
    Images.findByPk(cred.id).then(function (img) {
    console.log(img)
    img.update({
      imageName: req.body.imageName,
      imageData: req.file.path
    })
  })
    .then(async function (user) {
      console.log('image added')
      return res.location('/').status(200).json({ 'Message': 'Image Uploaded' });
    }).catch(function (err) {
      if (err.name === "SequelizeValidationError") {
        console.log(err)
        return res.status(400).json({ 'Error': err.message });
      } else {
        throw err;
      }
    }).catch(function (err) {
      res.json({ 'Error': err });
    });
  });   
});   

router.put('/', authUser.authenticateUser, function (req, res) {
  const credentials = auth(req);
  Credential.findOne({
    where: {
      username: credentials.name
    }
  }).then(function (cred) {
    User.findByPk(cred.id).then(function (user) {
    user.update(req.body)
    })
      .then(function (user) {
        console.log('User Added');
        return res.location('/').sendStatus(200).json({ 'Message': 'Details Updated' }).end();
      }).catch(function (err) {
        if (err.name === "SequelizeValidationError") {
          console.log(err)
          return res.status(400).json({ 'Error': err.message });
        } else {
          throw err;
        }
      }).catch(function (err) {
        console.log(err);
        res.send(500);
      });
  });
});

router.get('/', authUser.authenticateUser, function (req, res) {
  const credentials = auth(req);
  Credential.findOne({
    where: {
      username: credentials.name
    }
  }).then(function (cred) {
      User.findAll({
        where: {
         credId: cred.id
        },
        include: [
          {
            model: Credential,
          // as: 'credId'
          },
          {
            model: Images,
          // as: 'credId'
          }
        ]
    }).then(function (user) {
        console.log(user);
        return res.status(200).json({ user }).end();
      }).catch(function (err) {
        if (err.name === "SequelizeValidationError") {
          console.log(err)
          return res.status(400).json({ 'Error': err.message });
        } else {
          throw err;
        }
      }).catch(function (err) {
        console.log(err);
        res.send(500);
      });
  });
})


module.exports = router;