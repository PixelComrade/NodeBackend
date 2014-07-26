// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var payment = require('./app/service/payment')
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);



var paymentData = {
    receivers: {
        "receiver":[{
            "amount":"10.00",
            "email":"wxbh@hack.com"}
        ]
    },
    returnUrl: "http://192.168.96.72:8100/#/tab/pay",
    cancelUrl: "http://192.168.96.72:8100/#/tab/pay"
}
//payment.preparePayment(paymentData);

//payment.getPaymentDetails("AP-2YS23111XB929674X");