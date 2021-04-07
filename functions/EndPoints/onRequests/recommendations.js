const admin = require("firebase-admin");
const functions = require("firebase-functions");
const Serializer = require("../../Models/Serializer");
const QuadTree = require("../../Models/Quadtree");
const Rectangle = require("../../Models/Rectangle");
const Business = require("../../Models/Business");
const quadTreeFunctions = require("../../function_files/quadtree_functions");


let quadtree;
(async() =>{
     quadtree = await quadTreeFunctions.loadAndDeserialize();
});


exports.getQuadTree = functions.https.onRequest(async (request,response) =>{
    const quadTree = await quadTreeFunctions.loadAndDeserialize();
    response.send(JSON.stringify(quadTree));
});



exports.getLocalBusinesses = functions.https.onRequest(async (request, response)=>{

const longitude = request.body.longitude;
const latitude = request.body.latitude;
const rangeConst = 0.33;


//if the request is ok query the quadtree
if (longitude != undefined && latitude != undefined){

    quadtree == quadtree || await quadTreeFunctions.loadAndDeserialize();

    //query the quadtree
    let found = [];
    const range = new Rectangle(longitude-rangeConst,latitude-rangeConst,rangeConst*2,rangeConst*2);
    quadtree.query(range, found);

    //collect ids
    let ids =[];
    for (let i =0; i< found.length; i++){
        ids.push(found[i].businessId)
    }

    //get businesses from firestore
    const businessses = await admin.firestore().collection("businesses")
        .where('businessId','in',ids)
        .get();

    let list = [];
    businesses.forEach( business =>{
        list.push(business.data())
    });

                
    response.status(200)
        .type('application/json')
        .send(JSON.stringify(list));
}
//if the request isnt ok, return random businesses
else{
    const randomBusinesses = await admin.firestore()
    .collection("businesses")
    .limit(6)
    .get()

    let list =[];
    randomBusinesses.forEach(document =>{
        list.push(document.data());
    });
    
    response.status(200)
        .type('application/json')
        .send(JSON.stringify(list));   
}
});

