const functions = require("firebase-functions");
const admin = require ("firebase-admin");

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