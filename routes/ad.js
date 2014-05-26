var db = require('../db.js');
var pool = db.dbPool;

exports.find = function(req, res) {
    var title = req.param('title');
    var location = req.param('location');
    var status = req.param('status');
    
    pool.getConnection(function(err, connection) {
       connection.query('SELECT id from Book where title = ?', [title], function(err, rows, fields) {
           if (err) {
             console.log("Error fetching book id... :" + err);
             res.json({status:500});  
           } else {
               if (rows.length > 0) {
                   console.log('Book id is ' + rows[0].id);
                   connection.query('SELECT * from Ad where book_id = ? AND location = ? AND ad_status = ?', [rows[0].id, location, status], function(err, rows, fields) {
                    if (err) {
                        console.log("Error fetching message... :" + err);
                        res.json({status:500});
                    } else {
                        if (rows.length > 0) {
                            console.log("Got the user back, rows[0].fbId is " + rows[0].fb_id);
                            res.json({ads:rows});
                        } else {
                            res.json({});
                        }
                    }
                   });
               } else {
                   res.json({});
               }
           }
       });
      connection.release(); 
    });
};

exports.postAd = function(req, res) {
    var title = req.param('title');
    var email = req.param('email');
    var location = req.param('location');
    var latitude = req.param('latitude');
    var longitude = req.param('longitude');
    var status = req.param('status');
    var price = req.param('price');
    var description = req.param('description');
    
    var payload = {};
    pool.getConnection(function(err, connection) {
       connection.query('SELECT id from Book where title = ?', [title], function(err, rows, fields) {
           if (err) {
             console.log("Error fetching book id... :" + err);
             res.json({status:500});  
           } else {
               if (rows.length > 0) { // we have the book id. now can just post the add
                   console.log('Book id is ' + rows[0].id);
                   console.log('email: ' + email);
                   console.log('location: ' + location);
                   console.log('latitude: ' + latitude);
                   console.log('longitude: ' + longitude);
                   postAdInternal(connection, rows[0].id, email, location, latitude, longitude, status, res, payload, price, description);
               } else { // there is no such book in the system.... need to add it and then post the ad relying on the created book id
                   connection.query("INSERT INTO Book SET ?", {title:title, author:null}, function(err, result) {
                    if (err) {
                        console.log("Error adding new book... :" + err);
                        res.json({status:500});
                    } else {
                        console.log("Successfully added a new book!");
                        connection.query('SELECT id from Book where title=?', [title], function(err, bookIdRows, fields) {
                            if (err) {
                                console.log("Error fetching book id... :" + err);
                                res.json({status:500});  
                            } else {
                                postAdInternal(connection, bookIdRows[0].id, email, location, latitude, longitude, status, res, payload, price, description);
                            }
                        });
                    }
                   });
               }
           }
       });
      connection.release(); 
    });
};

postAdInternal = function(connection, bookId, email, location, latitude, longitude, status, res, payload, price, description) {
    payload.email = email;
    payload.book_id = bookId;
    payload.ad_status = status;
    payload.lat = latitude;
    payload.lng = longitude;
    payload.location = location;
    payload.price = price;
    payload.description = description;
    payload.post_time = null;
    payload.lat = latitude;
    payload.lng = longitude;
    connection.query('INSERT INTO Ad SET ?', payload, function(err, adRows, fields) {
        if (err) {
            console.log("Error inserting ad... :" + err);
            res.json({
                status : 500
            });
        } else {
            if (adRows.length > 0) {
                res.json({ ads : adRows });
            } else {
                res.json({});
            }
        }
    });
}

