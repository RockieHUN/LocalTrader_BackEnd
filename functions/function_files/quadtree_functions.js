const admin = require("firebase-admin");
const functions = require("firebase-functions");
const QuadTree = require("../Models/Quadtree");
const Rectangle = require("../Models/Rectangle");
const Business = require("../Models/Business");
const Serializer = require("../Models/Serializer");

module.exports.createAndSave = async function createAndSave() {
    const min_lat = -85;
    const max_lat = 85;
    const min_long = -180;
    const max_long = 180;


    const snapshot = await admin.firestore()
        .collection("businesses")
        .get();
        
    let businesses = [];

    //get businesses
    snapshot.forEach(doc =>{
        
        const id = doc.id;
        const latitude = doc.get("latitude");
        const longitude = doc.get("longitude");
                
        businesses.push(
            new Business(id,longitude,latitude)
        );
    });

    let quadTree = new QuadTree( new Rectangle(min_long, min_lat, 2*max_long, 2*max_lat), 4);
    quadTree.createTree(businesses);
    
    //save the three to the database
    await admin.firestore()
        .collection('quadtree')
        .doc('quadtree')
        .set({"tree": JSON.stringify(quadTree)});
}


module.exports.loadAndDeserialize = async function loadAndDeserialize(){
    const document = await admin.firestore().collection('quadtree')
            .doc('quadtree')
            .get()

    const quadtreeJson = JSON.parse(document.get("tree"));
    let serializer = new Serializer();

    let quadTree = serializer.deserializeQuadtree(quadtreeJson, QuadTree.prototype, Rectangle.prototype, Business.prototype);
    return quadTree;
}