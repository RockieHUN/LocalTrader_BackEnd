
const algoliasearch = require("algoliasearch");
const functions = require("firebase-functions");

const ALGOLIA_APP_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.admin_api_key;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_api_key;

const ALGOLIA_BUSINESS_INDEX_NAME = 'businesses';
const client = algoliasearch(ALGOLIA_APP_ID,ALGOLIA_ADMIN_KEY);


module.exports.saveToAlgolia = async function saveToAlgolia(business, businessId){
    const newObject = {
        "objectID" : businessId,
        "businessName" : business.name
    };

    business.objectID = businessId;

    const index = client.initIndex(ALGOLIA_BUSINESS_INDEX_NAME);
    index.saveObject(newObject);
   }