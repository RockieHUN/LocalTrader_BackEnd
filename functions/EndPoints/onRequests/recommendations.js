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
const listMaxSize = 6;

let list = [];

//------------ FIRST PHASE --------------

if (longitude != undefined && latitude != undefined){

    quadtree == quadtree || await quadTreeFunctions.loadAndDeserialize();

    if (quadtree != undefined){
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

        businesses.forEach( business =>{
            list.push(business.data())
        });
    }
    else{
        await getRandomBusinesses(list, 12);
    }                
}
//if the request isnt ok, return random businesses
else{
    await getRandomBusinesses(list, 12);
}

//------------ SECOND PHASE ----------------

if (list.length > listMaxSize){
    list = getRandomsFromList(list);
}

if (list.length < listMaxSize){
   // await getRandomBusinesses(list, listMaxSize - list.length)
}



response.status(200)
    .type('application/json')
    .send(JSON.stringify(list));   
});




async function getRandomBusinesses(list, limit){

    console.log("limit: ", limit);
    const randomBusinesses = await admin.firestore()
    .collection("businesses")
    .limit(limit)
    .get()

    randomBusinesses.forEach(document =>{
        if (!list.includes(document.data)){
            list.push(document.data());
        }  
    });
}

function getRandomsFromList(list){
    let numberOfRandoms = 6;
    let randomList = [];
    

    while( numberOfRandoms ){
        let randomNumber = Math.floor(Math.random() * (list.length - 0) + 0);
        randomList.push(list[randomNumber]);
        list.splice(randomNumber, 1);
        numberOfRandoms = numberOfRandoms - 1;
    } 
    return randomList;
     
}

