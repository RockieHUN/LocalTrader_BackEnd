
const algoliasearch = require("algoliasearch");
const functions = require("firebase-functions");

const ALGOLIA_APP_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.admin_api_key;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_api_key;

const ALGOLIA_BUSINESS_INDEX_NAME = 'businesses';
const client = algoliasearch(ALGOLIA_APP_ID,ALGOLIA_ADMIN_KEY);

    
  

    exports.search = functions.https.onRequest( async( request, response) =>{

        const searchTerm = request.body.searchTerm;

        if (searchTerm == null || searchTerm == undefined){
            response.status(200)
            .type('application/json')
            .send([]);
        }


        const index = client.initIndex(ALGOLIA_BUSINESS_INDEX_NAME);
        
        const responses = await index.search(searchTerm,{
            attributesToRetrieve: ['businessName','objectID'],
            hitsPerPage : 10
        });
            
        const hits = responses.hits;

        let list = [];
        hits.forEach(hit => {
            list.push({
                "businessName" : hit.businessName,
                "businessId" :hit.objectID
            });
        });

        response
        .status(200)
            .type('application/json')
            .send(JSON.stringify(list));     
});