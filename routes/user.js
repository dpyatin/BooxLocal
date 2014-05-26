var db = require('../db.js');
var pool = db.dbPool;
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.FBLogin = function(req, res) {
    var FBID = req.param('FBID');
    req.session.FBID = FBID;
}

exports.find = function(req, res) {
    var id = req.param('id');
    // validation for categoryID
    console.log("id is : " + id);
    pool.getConnection(function(err, connection) {
       connection.query('SELECT fb_id from User where id = ?', [id], function(err, rows, fields) {
        if (err) {
            console.log("Error fetching user... :" + err);
            res.json({status:500});
        } else {
            if (rows.length > 0) {
                console.log("Got the user back, rows[0].fbId is " + rows[0].fb_id);
                res.json({fbId: rows[0].fb_id});
            } else {
                res.json({});
            }
        }
      });
      connection.release(); 
    });
};

exports.createUser = function(req, res) {
    var fbId = req.body.fbId;
    console.log('createUser hit. fbId: ' + fbId);
    var post  = {fb_id: fbId};
    
    pool.getConnection(function(err, connection) {
        connection.query("INSERT INTO User SET ?", post, function(err, result) {
            if (err) {
                console.log("Error fetching user... :" + err);
                res.json({status:500});
            } else {
                console.log("Insertion successful");
                res.json({status:200});
            }
        });
        connection.release();
    });   
}


