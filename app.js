const express = require("express");
const app = express();
const admin = require("firebase-admin");

var serviceAccount = require('./serviceAccountKey.json');

// app.get('/api/hello', (req, res) => {
//   res.send({ express: 'Hello From Express' });
// });
const routeConfig = require("./config/route-config.js");
routeConfig.init(app);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://trek-tribe-d15ae.firebaseio.com"
  });



module.exports = app;