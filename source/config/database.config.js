const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const User = require('../models/User');
const encryption = require('../utilities/encryption');

function seedAdmin() {
    return new Promise((resolve, reject) => {
        User.find({username: 'Admin'}).then(users => {
            if (users.length === 0) {
                let pwd = 'Admin';
                let salt = encryption.generateSalt();
                let hashedPwd = encryption.generateHashedPassword(salt, pwd);

                let adminData = {
                    username: 'Admin',
                    firstName: 'Dani',
                    lastName: 'Mihaylov',
                    salt: salt,
                    password: hashedPwd,
                    age: 33,
                    gender: 'Male',
                    roles: ['Admin'],
                };

                User.create(adminData).then(admin => {
                    console.log(`Seeded admin: ${admin.username}`);
                    resolve(admin._id);
                });
            }
        });
    });
}


module.exports = (config) => {
    "use strict";
    mongoose.connect(config.connectionString,{
        useMongoClient:true
    });

    let database = mongoose.connection;
    database.once('open', (err) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Connected!');
    });

    database.on('error', (err) => {
        console.log(err);
    });

    seedAdmin();
};

