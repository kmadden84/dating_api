'use strict';

const express = require('express');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const { sequelize, models } = require('../db');

const Sequelize = require('sequelize');
const { User, Credential } = models;

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
  }).then(async function (credentials) {
    if (!credentials) {
      return res.sendStatus(400);
    } else {
      return res.status(200).json({ 'id': credentials.id, 'First Name': credentials.first_name, 'Last Name': credentials.last_name, 'Email': credentials.username, 'Pass': credentials.password });
    }
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
