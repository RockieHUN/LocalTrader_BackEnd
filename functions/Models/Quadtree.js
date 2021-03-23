const Rectangle = require('./Rectangle');

    //min_lat : -85,
    //max_lat : 85,
    //min_long : -180,
    //lmax_long : 180

    
    module.exports =  class QuadTree{

        constructor(boundary, capacity){
            this.boundary = boundary;
            this.capacity = capacity;
            this.points = [];
            this.divided = false;
        }


        query(range, found){
            if (!found) {
                found = [];
            }
            if (!this.boundary.intersects(range)) {
                return;
            } else {
                for (let p of this.points) {
                if (range.contains(p)) {
                    found.push(p);
                }
                }
                if (this.divided) {
                this.northWest.query(range, found);
                this.northEast.query(range, found);
                this.southWest.query(range, found);
                this.southEast.query(range, found);
                }
            }
            return found;
        }



        subdivide(){
            let x = this.boundary.x;
            let y = this.boundary.y;
            let width = this.boundary.width;
            let height = this.boundary.height;

            let nw = new Rectangle(x, y + height/2, width/2, height/2);
            let ne = new Rectangle(x + width/2, y + height/2, width/2, height/2);
            let sw = new Rectangle(x, y, width/2, height/2);
            let se = new Rectangle(x + width/2, y, width/2, height/2);

            this.northWest = new QuadTree(nw, this.capacity);
            this.northEast = new QuadTree(ne, this.capacity);
            this.southWest = new QuadTree(sw, this.capacity);
            this.southEast = new QuadTree(se, this.capacity);

            this.divided = true;
        }

        createTree(points){
            for (let i =0; i< points.length; i++){
                this.insert(points[i]);
            }
        }



        insert(point){

            if (!this.boundary.contains(point)){
                return false;
            }

            if (this.points.length < this.capacity){
                this.points.push (point);
                return true;
            }
            else{
                if (!this.divided){
                    this.subdivide();
                }
                
                if (this.northWest.insert(point)) return true;
                if (this.northEast.insert(point)) return true;
                if (this.southWest.insert(point)) return true;
                if (this.southEast.insert(point)) return true;
            }
        }
    }


 