'use strict';

const bcryptjs = require('bcryptjs');
const Context = require('./context');

class Database {
  constructor(seedData, enableLogging) {
    this.credentials = seedData.Credential;
    this.images = seedData.Images;
    this.users = seedData.User;
    this.enableLogging = enableLogging;
    this.context = new Context('dating_api.db', enableLogging);
  }

  log(message) {
    if (this.enableLogging) {
      console.info(message);
    }
  }

  tableExists(tableName) {
    this.log(`Checking if the ${tableName} table exists...`);

    return this.context
      .retrieveValue(`
        SELECT EXISTS (
          SELECT 1 
          FROM sqlite_master 
          WHERE type = 'table' AND name = ?
        );
      `, tableName);
  }

  createCred(credential) {
    return this.context
      .execute(`
        INSERT INTO Credentials
          (first_name, last_name, username, password, createdAt, updatedAt)
        VALUES
          (?, ?, ?, ?, datetime('now'), datetime('now'));
      `,
      credential.first_name,
      credential.last_name,
      credential.username,
      credential.password);
  }
  createImage(image) {
    return this.context
      .execute(`
        INSERT INTO Images
          (imageName, imageData, createdAt, updatedAt)
        VALUES
          (?, ?, datetime('now'), datetime('now'));
      `,
      image.imageName,
      image.imageData
      );
  }
  createUser(user) {
    return this.context
      .execute(`
        INSERT INTO Users
          (fav_movie, fav_band, fav_song, looking_for, gender, drinking, education, build, living_status, age, ideal_vaca, fav_cheese, fav_timeofday, fav_mov_genre, fav_weather, fav_drink, fav_cuisine, credId, imgId, createdAt, updatedAt)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'));
      `,
      user.fav_movie,
      user.fav_band,
      user.fav_song,
      user.looking_for,
      user.gender,
      user.drinking,
      user.education,
      user.build,
      user.living_status,
      user.age,
      user.ideal_vaca,
      user.fav_cheese,
      user.fav_timeofday,
      user.fav_mov_genre,
      user.fav_weather,
      user.fav_drink,
      user.fav_cuisine,
      user.credId,
      user.imgId
      );
  }

  async hashUserPasswords(credentials) {
    const usersWithHashedPasswords = [];

    for (const credential of credentials) {
      const hashedPassword = await bcryptjs.hash(credential.password, 10);
      usersWithHashedPasswords.push({ ...credential, password: hashedPassword });
    }

    return usersWithHashedPasswords;
  }

  async createCreds(creds) {
    for (const cred of creds) {
      await this.createCred(cred);
    }
  }
  async createImages(images) {
    for (const image of images) {
      await this.createImage(image);
    }
  }
  async createUsers(users) {
    for (const user of users) {
      await this.createUser(user);
    }
  }

  async init() {
    const credTableExists = await this.tableExists('Credentials');

    if (credTableExists) {
      this.log('Dropping the Credentials table...');

      await this.context.execute(`
        DROP TABLE IF EXISTS Credentials;
      `);
    }

    this.log('Creating the Credential table...');

    await this.context.execute(`
      CREATE TABLE Credentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        first_name TEXT NOT NULL DEFAULT '', 
        last_name TEXT NOT NULL DEFAULT '', 
        username VARCHAR(255) NOT NULL DEFAULT '' UNIQUE, 
        password VARCHAR(255) NOT NULL DEFAULT '', 
        createdAt DATETIME NOT NULL, 
        updatedAt DATETIME NOT NULL
      );
    `);

    this.log('Hashing the user passwords...');

    const credentials = await this.hashUserPasswords(this.credentials);

    this.log('Creating the user records...');

    await this.createCreds(credentials);

    const imgTableExists = await this.tableExists('Images');

    if (imgTableExists) {
      this.log('Dropping the Images table...');

      await this.context.execute(`
        DROP TABLE IF EXISTS Images;
      `);
    }

    this.log('Creating the Images table...');

    await this.context.execute(`
      CREATE TABLE Images (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL DEFAULT '', 
        imageName VARCHAR(255) NOT NULL DEFAULT '',
        imageData VARCHAR(255) NOT NULL DEFAULT '', 
        createdAt DATETIME NOT NULL, 
        updatedAt DATETIME NOT NULL
      );
    `);

    this.log('Creating the image records...');

    await this.createImages(this.images);

    const userTableExists = await this.tableExists('Users');

    if (userTableExists) {
      this.log('Dropping the Users table...');

      await this.context.execute(`
        DROP TABLE IF EXISTS Users;
      `);
    }

    this.log('Creating the User table...');

    await this.context.execute(`
      CREATE TABLE Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        fav_movie VARCHAR(255) NOT NULL, 
        fav_band VARCHAR(255) NOT NULL, 
        fav_song VARCHAR(255) NOT NULL, 
        looking_for VARCHAR(255) NOT NULL, 
        gender VARCHAR(255) NOT NULL, 
        drinking VARCHAR(255) NOT NULL, 
        education VARCHAR(255) NOT NULL, 
        build VARCHAR(255) NOT NULL, 
        living_status VARCHAR(255) NOT NULL, 
        age INTEGER NOT NULL, 
        ideal_vaca VARCHAR(255) NOT NULL, 
        fav_cheese VARCHAR(255) NOT NULL, 
        fav_timeofday VARCHAR(255) NOT NULL, 
        fav_mov_genre VARCHAR(255) NOT NULL, 
        fav_weather VARCHAR(255) NOT NULL, 
        fav_drink VARCHAR(255) NOT NULL, 
        fav_cuisine VARCHAR(255) NOT NULL, 
        createdAt DATETIME NOT NULL, 
        updatedAt DATETIME NOT NULL, 
        credId INTEGER DEFAULT -1 
          REFERENCES Credentials (id) ON DELETE CASCADE ON UPDATE CASCADE,
        imgId INTEGER DEFAULT -1 
          REFERENCES Images (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    this.log('Creating the user records...');

    await this.createUsers(this.users);

    this.log('Database successfully initialized!');
  }
}

module.exports = Database;
