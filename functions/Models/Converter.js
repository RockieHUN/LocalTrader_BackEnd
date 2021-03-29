module.exports = class Converter{
    constructor(){}

    businessListToObjectList(businessList){
        let objectList =[];
        for (let i = 0; i< businessList.length; i++){
            objectList.push(this.businessToObject(businessList[i]));
        }
        return objectList;
    }

    businessToObject(business){
        return {
            businessId :business.businessId,
            category : business.category
        }
    }
}