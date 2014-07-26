// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var payment = require('./app/service/payment')
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// Models
var Users       = require('./app/models/charities');
var Charities   = require('./app/models/jobs');
var Jobs        = require('./app/models/users');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '192.168.96.68',
  user     : 'dev2',
  password : 'dev2'
});

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());
app.use(allowCrossDomain);
app.use(function(req, res, next) {
    console.log('Method: ' + req.method + ' url: ' + req.url);
    next();
});

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/users/login')

    .post(function(req, res) { 

        console.log(req.body.AccountName);

        //var output = {};
        //res.json(output);

        var sql = "SELECT * FROM back.users WHERE AccountName = '" + req.body.AccountName + "'";

        //connection.connect();
        connection.query(sql, function(err, rows, fields) {
            if (err) throw err;

            //console.log(rows[0]['id']);
            //console.log(rows[0]['Password']);
            //console.log(req.body.Password);

            if(rows[0]['Password'] == req.body.Password) {
                res.json({user: rows[0]});
            }
            else
                res.json({error: 'Password doesn\'t match'});
        });
        //connection.end(); 

        //res.json({error: 'No'});
    });

router.route('/users/add')

    .post(function(req, res) { 

        var sql1 = 'INSERT INTO `back`.`users` (`AccountName`, `Password`, `FirstName`, `Surname`, `PhoneNo`, `Email`, `PayPalAccount`, `SellerPoints`, `BuyerPoints`) VALUES ';
        var sql2 = '("' + req.body.AccountName + 
            '","' + req.body.Password + 
            '","' + req.body.FirstName + 
            '","' + req.body.Surname + 
            '","' + req.body.PhoneNo + 
            '","' + req.body.Email + 
            '","' + req.body.PayPalAccount + 
            '","0","0")';

        connection.query(sql1 + sql2, function(err, rows, fields) {
            if (err) throw err;

            sqlresult = "SELECT * FROM back.users WHERE AccountName = '" + req.body.AccountName + "'";
            connection.query(sqlresult, function(err, rows, fields) {
                if (err) throw err;
                res.json({user: rows[0]});
            });
        });
    });

router.route('/jobs/fetch')

    .get(function(req, res) {

        var sql = "";
        if(req.body.id != null) {

            sql = "SELECT * FROM back.jobs";
            connection.query(sql, function(err, rows, fields) {
                if (err) throw err;
                res.json({jobs: rows});
            });
        }
        else {

            sql = "SELECT * FROM back.jobs WHERE id = '" + id + "'";
            connection.query(sql, function(err, rows, fields) {
                if (err) throw err;
                res.json({job: rows[0]});
            });
        }        
    });

router.route('/jobs/add')

    .post(function(req, res) {

        // ('1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1');

        var sql1 = 'INSERT INTO `back`.`jobs` (`JobName`, `Description`, `Location`, `Owner`, `AssignedTo`, `Charity`, `CharityAmount`, `AssignedToAmount`, `CharityReceipt`, `AssignedToReceipt`, `Status`) VALUES ';
        var sql2 = '("' + req.body.JobName + 
            '","' + req.body.Description + 
            '","' + req.body.Location + 
            '","' + req.body.Owner + 
            '","' + '' + 
            '","' + '' + 
            '","' + req.body.CharityAmount + 
            '","' + req.body.AssignedToAmount + 
            '","' + '' + 
            '","' + '' + 
            '","' + "Listed" + 
        '")';

        connection.query(sql1 + sql2, function(err, rows, fields) {
            if (err) throw err;

            sqlresult = "SELECT * FROM back.jobs WHERE JobName = '" + req.body.JobName + "'";
            connection.query(sqlresult, function(err, rows, fields) {
                if (err) throw err;
                res.json({job: rows[0]});
            });
        });
    });

router.route('/jobs/complete')

    .post(function(req, res) {

        // Get the job id

        var sql = 'UPDATE `back`.`jobs` SET ' +
            '`Charity`="' + req.body.Charity + '",' + 
            '`CharityReceipt`="' + req.body.CharityReceipt + '",' + 
            '`AssignedToReceipt`="' + req.body.AssignedToReceipt + '",' + 
            '`Status`="' + req.body.Status + '",' + 
            'WHERE id = "' + req.body.JobId + '"';

        connection.query(sqlresult, function(err, rows, fields) {
            if (err) throw err;
            res.json({status: 'complete'});
        });

        sql = null;
        sql = 'UPDATE `back`.`users` SET ' +
            '`BuyerPoints`="' + req.body.BuyerPoints + '",' + 
            '`SellerPoints`="' + req.body.SellerPoints + '",' + 
            'WHERE id = "' + req.body.UserId + '"';

        connection.query(sqlresult, function(err, rows, fields) {
            if (err) throw err;
            res.json({status: 'complete'});
        });
    });

router.route('/charities/fetch')

    .get(function(req, res) {

        var sql = "";
        if(req.body.id != null) {

            sql = "SELECT * FROM back.charities";
            connection.query(sql, function(err, rows, fields) {
                if (err) throw err;
                res.json({charities: rows});
            });
        }
        else {

            sql = "SELECT * FROM back.charities WHERE id = '" + id + "'";
            connection.query(sql, function(err, rows, fields) {
                if (err) throw err;
                res.json({charity: rows[0]});
            });
        }    
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
