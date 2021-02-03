const functions = require("firebase-functions");
const admin = require ("firebase-admin");
const serviceAccount = require('./ServiceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

exports.register = functions.https.onRequest((request, response) => {

    // response.set('Access-Control-Allow-Origin', '*');

    const uid = "123123";
   admin
   .auth()
   .createUser({
           uid: uid,
           email: "kuki@gmail.com",
           password: "Asd1999"
    })
    .then( (userRecord) => {
        console.log("success");

        admin
            .auth()
            .createCustomToken(uid)
            .then((customToken) => {
                response.send(customToken)
            })
            .catch((error) => {
                console.log('Error creating custom token:', error);
                response.send("Error creating token");
              });
        // response.send(userRecord.uid);
    })
    .catch( (error) =>{
        console.log("Error creating user", error);
        response.send("Error creating user");
    });
  
});