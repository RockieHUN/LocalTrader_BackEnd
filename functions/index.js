
const dataValidation = require("./dataValidation");
const QuadTree = require("./Models/Quadtree");
const Rectangle = require("./Models/Rectangle");
const Business = require("./Models/Business");
const functions = require("firebase-functions");
const admin = require ("firebase-admin");
const serviceAccount = require('./ServiceAccountKey.json');



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  exports.createQuadTree = functions.https.onRequest( (request, respose ) => {

    const min_lat = -85;
    const max_lat = 85;
    const min_long = -180;
    const max_long = 180;

    let businesses = [];
    for (let i = 0 ; i< 10; i++){
        businesses.push(
            new Business("",Math.random() * (-80 - 10) + 10,Math.random() * (-80 - 10) + 10)
        );
    }
 
    let quadTree = new QuadTree( new Rectangle(min_long, min_lat, 2*max_long, 2*max_lat), 4);
    quadTree.createTree(businesses);

   

    
    respose.send(JSON.stringify(quadTree));
  });


  exports.sendNotification = functions.firestore.document("orderRequests/{requestId}")
        .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Firestore
       const orderRequest = snapshot.data();
       
       const businessId = orderRequest.businessId
       const clientID = orderRequest.clientId
       const clientFirstName = orderRequest.clientFirstName
       const clientLastName = orderRequest.clientLastName

       console.log(businessId," ", clientID)

       //get clientToken
       const clientToken = admin.firestore()
       .collection("users")
       .doc(clientID)
       .get()
       .then((snapshot) =>{
           
            //get business owners token
            console.log("****CLIENT TOKEN*****" , snapshot.get("messagingToken"));
            admin.firestore().collection("users").where("businessId", '==', businessId)
            .get()
            .then((snapshot2) =>{

                if (snapshot2.empty) return;

                //create payload
                const payload = {
                    notification: {
                              title:   "Rendelése érkezett",
                              body:    clientFirstName + " " + clientLastName + " rendelést adott fel"
                 }
                };

                //create a list of target tokens
                var list = [];
                snapshot2.forEach(doc => {
                    list.push(doc.get("messagingToken"));
                    console.log("****OWNER TOKEN*****", doc.get("messagingToken"));
                })

                console.log("LIST" ,list);

                //send message
                admin.messaging().sendToDevice(list, payload)
            })
       }
       );

            
        });
      

/*exports.register = functions.https.onRequest((request, response) => {

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


}); */

/*exports.popularBusinesses = functions.firestore
    .document("businesses/{businessId}")
    .onCreate( (snapshot, context) => {
        
        const db = admin.firestore();
        const newBusiness = snapshot.data();
        const businessId = snapshot.id;

        const businesses = db.collection("promotedBusinesses")
            .get()
            .then( () => {
                if (businesses.size < 2)
                {
                    const ref = db.collection("promotedBusinesses").doc(businessId);
                    ref.set({"businessID": businessId});
                }
            });
        
        //console.log(newBusiness);
       


    });*/

