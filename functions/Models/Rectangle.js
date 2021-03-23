module.exports= class Rectangle{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    contains(point){
        return (
            point.x > this.x &&
            point.x < this.x + this.width &&
            point.y > this.y &&
            point.y < this.y + this.height
        );
    }

    intersects(range){
        return !(
            range.x > this.x + this.width ||
            range.x + range.width < this.x ||
            range.y > this.y + this.height ||
            range.y + range.height < this.y
        )
    }
}