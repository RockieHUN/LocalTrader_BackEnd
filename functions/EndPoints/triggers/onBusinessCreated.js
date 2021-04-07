
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const quadTreeFunctions = require("../../function_files/quadtree_functions");
const search_functions = require('../../function_files/search_functions');



exports.onBusinessCreated = functions.firestore.document('businesses/{businessId}')
        .onCreate( async (snapshot, context) =>{
            const business = snapshot.data();
            
            search_functions.saveToAlgolia(business, context.params.businessId);
            quadTreeFunctions.createAndSave();
            return;
        });


