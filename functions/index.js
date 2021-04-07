
const functions = require("firebase-functions");
const admin = require ("firebase-admin");
const serviceAccount = require('./ServiceAccountKey.json');




admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });


  //exports.algolia = require("./EndPoints/onRequests/search");
  //exports.notifications = require("./function_files/notifications");
  //exports.recommendations = require("./function_files/recommendations");

  exports.onBusinessCreated = require("./EndPoints/triggers/onBusinessCreated");
  exports.recommendations = require("./EndPoints/onRequests/recommendations");
       

