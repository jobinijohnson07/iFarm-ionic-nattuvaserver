let axios  = require('axios'),
    url    = require('../config/urls.json')

module.exports.issueContract =  function(contractData, name){
    let requestUrl = url.cloudMachineUrl + 'issue',
        reqBody    = {
            "sellerName"        : contractData['sellerName'],
	        "buyerName"         : name,
	        "productId"         : contractData['productId'],
	        "productName"	    : contractData['name'],
	        "total"             : contractData['total'],
            "quantity"          : contractData['quantity'],
	        "deliveryDate"      : contractData['deliveryDate'],
        },
        headers     = {
            "Content-Type" : 'application/json'
        } ;
    console.log("requestbody is ",reqBody);
    console.log("sending contract issue request to ",requestUrl);
     return axios.post(requestUrl,reqBody,headers)
        .then(receipt => {
           console.log("txn receipt received is ",receipt)
           return Promise.resolve(receipt);
        })
        .catch(err=>{
            console.error("error in writing to blockchain ",err);
            return Promise.reject(err);
        })
}