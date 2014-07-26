'use strict'
var querystring = require('querystring');
var http = require('https')

var payment = {



    preparePayment: function(paymentData) {
        var post_data = JSON.stringify({
            "actionType":"PAY",    // Specify the payment action
            "currencyCode":"USD",  // The currency of the payment
            "receiverList": paymentData.receivers,
            // Where the Sender is redirected to after approving a successful payment
            "returnUrl":paymentData.returnUrl,
            // Where the Sender is redirected to upon a canceled payment
            "cancelUrl":paymentData.cancelUrl,
            "requestEnvelope":{
                "errorLanguage":"en_US",    // Language used to display errors
                "detailLevel":"ReturnAll"   // Error detail level
            }
        });

        // An object of options to indicate where to post to
        var post_options = {
            host: 'svcs.sandbox.paypal.com',
            path: '/AdaptivePayments/Pay',
            method: 'POST',
            headers: {
                'X-PAYPAL-SECURITY-USERID' : 'wxbh_api1.hack.com',
                'X-PAYPAL-SECURITY-PASSWORD' : '1406348042',
                'X-PAYPAL-SECURITY-SIGNATURE' : 'AHFbToTScZm9mlhLyNw3SHwgLkL1AFbtVmcqHVIG37KRPiX2N7Tpmidh',
                'X-PAYPAL-REQUEST-DATA-FORMAT' : 'JSON',
                'X-PAYPAL-RESPONSE-DATA-FORMAT' : 'JSON',
                'X-PAYPAL-APPLICATION-ID' : 'APP-80W284485P519543T'
            }
        };

        // Set up the request
        var post_req = http.request(post_options, function(res) {
            console.log("statusCode: ", res.statusCode);
            console.log("headers: ", res.headers);
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('Response: ' + chunk);
            });
        });

        post_req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });

        console.log(post_data)
        // post the data
        post_req.write(post_data);
        post_req.end();
    }



};



module.exports = payment;