let  admin    = require('firebase-admin');

module.exports = !admin.apps.length ? admin.initializeApp() : admin.app();