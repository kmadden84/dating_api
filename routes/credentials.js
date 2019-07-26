'use strict';

const express = require('express');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const { sequelize, models } = require('../db');

const Sequelize = require('sequelize');
const { User, Credential, Images, Messages } = models;

// const Credentials = require('../models').Credential;
// const Users = require('../models').User;


const router = express.Router();
const authUser = require('./authenticate.js');



router.get('/', authUser.authenticateUser, (req, res) => {
  const credentials = auth(req);
  Credential.findOne({
    where: {
      username: credentials.name
    }
  }).then(function (cred) {
    var cred = cred
      User.findOne({
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
          },
          {
            model: Messages,
             //as: 'recipientId'
          },
        ]
  })
  .then(function (user, cred) {
    if (!user) {
    Credential.findOne({
      where: {
        username: credentials.name
      }
    }).then(function (creds) {
      return res.status(200).json({ 'id': creds.id, 'First Name': creds.first_name, 'Last Name': creds.last_name, 'Email': creds.username, 'Pass': creds.password });
    })
  }
    else {
  return res.status(200).json({ 'id': user.Credential.id, 'First Name': user.Credential.first_name, 'Last Name': user.Credential.last_name, 'Email': user.Credential.username, 'Pass': user.Credential.password, 'Messages': user.Messages });

    }

  //  } else {
      //return res.status(200).json({ 'cred': cred.id });
   //// }
  }).catch(function (err) {
    res.json({ 'Error': err });
  });
})
})


router.get('/messages', authUser.authenticateUser, (req, res) => {
  const credentials = auth(req);
  Credential.findOne({
    //order: [["description", "DESC"]],
    where: {
      username: credentials.name
    }
  }).then(function (cred) {
      Messages.findAndCountAll({
        where: {
          recipientId: cred.id
        },
          include: [
            {
              model: Credential,
              attributes: ['id','first_name', 'last_name', 'username']
            },
          ]
  }).then(function (msg) {
    return res.status(200).json({ 'count': msg.rows });
  }).catch(function (err) {
    res.send(500);
  });
});
});


router.get('/messages/:id', authUser.authenticateUser, (req, res) => {
  const credentials = auth(req);
  const id = req.params.id;
      Messages.findOne({
        where: {
          id: req.params.id
        },
          include: [
            {
              model: Credential,
              attributes: ['id','first_name', 'last_name', 'username']
            },
          ]
  }).then(function (msg) {
    return res.status(200).json({ msg});
  }).catch(function (err) {
    res.send(500);
  });
});






router.post('/', function (req, res) {
  Credential.create(req.body).then(function (user) {
    return res.location('/').status(200).json({ 'Message': 'User Added' });
  }).catch(function (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({ 'Error': err.message  });
    } else {
      throw err;
    }
  }).catch(function (err) {
    res.json({ 'Error': err });
  });
});

module.exports = router;