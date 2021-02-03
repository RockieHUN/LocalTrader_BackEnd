
const dataValidation = require("./dataValidation");
const functions = require("firebase-functions");
const admin = require ("firebase-admin");
const serviceAccount = require('./ServiceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

exports.register = functions.https.onRequest((request, response) => {

    // response.set('Access-Control-Allow-Origin', '*');

    const clientData = request.body;

    if ( dataValidation.validateRegistration(clientData) != 0)
    {
        response.send("Invalid credentials!");
    }
    else
    {
        admin
        .auth()
        .createUser({
                uid: clientData["email"],
                email: clientData["email"],
                password: clientData["password"]
            })
            .then( (userRecord) => {
                console.log("success");

                admin
                    .auth()
                    .createCustomToken(clientData["email"])
                    .then((customToken) => {
                        response.send({"token": customToken});
                    })
                    .catch((error) => {
                        console.log(error);
                        response.send(error);
                    });
            })
            .catch( (error) =>{
                
                console.log(error);
                response.send(error);
            });
    }


   
  
});




