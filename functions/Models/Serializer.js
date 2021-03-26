module.exports = class Serializer{
    /*constructor(types){this.types = types;}
    serialize(object) {
        let idx = this.types.findIndex((e)=> {return e.name == object.constructor.name});
        if (idx == -1) throw "type  '" + object.constructor.name + "' not initialized";
        return JSON.stringify([idx, Object.entries(object)]);
    }
    deserialize(jstring) {
        let array = JSON.parse(jstring);
        let object = new this.types[array[0]]();
        array[1].map(e=>{object[e[0]] = e[1];});
        return object;
    }
    */
   constructor(){}

    toClass(obj, proto){
        obj.__proto__ = proto;
        return obj;
    }


    deserializeQuadtree(json, treeProto, rectProto, pointProto){

        let quadtree = this.toClass(json, treeProto)
        quadtree.boundary = this.toClass(quadtree.boundary, rectProto);

        if (quadtree.points){
            let newPoints = [];
            for (let i = 0; i < quadtree.points.length; i++){
                newPoints.push( this.toClass(quadtree.points[i], pointProto));
            }
            quadtree.points = newPoints;
        }
        


        if (quadtree.divided){
            quadtree.northWest = this.deserializeQuadtree(quadtree.northWest, treeProto, rectProto, pointProto);
            quadtree.northEast = this.deserializeQuadtree(quadtree.northEast, treeProto, rectProto, pointProto);
            quadtree.southWest = this.deserializeQuadtree(quadtree.southWest, treeProto, rectProto, pointProto);
            quadtree.southEast = this.deserializeQuadtree(quadtree.southEast, treeProto, rectProto, pointProto);
        }

        return quadtree;
    }
}