var db = require('../db.js');
var pool = db.dbPool;

exports.find = function(req, res) {
    var title = req.param('title');
    var location = req.param('location');
    // validation for categoryID
    
    // find the ID from the books table
    console.log("location is : " + location);
    pool.getConnection(function(err, connection) {
       connection.query('SELECT id from Book where title = ?', [title], function(err, rows, fields) {
           if (err) {
             console.log("Error fetching book id... :" + err);
             res.json({status:500});  
           } else {
               if (rows.length > 0) {
                   console.log('Book id is ' + rows[0].id);
                   connection.query('SELECT * from Message where book_id = ? AND location = ?', [rows[0].id, location], function(err, rows, fields) {
                    if (err) {
                        console.log("Error fetching message... :" + err);
                        res.json({status:500});
                    } else {
                        if (rows.length > 0) {
                            console.log("Got the user back, rows[0].fbId is " + rows[0].fb_id);
                            res.json({messages:rows});
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

exports.postMessage = function(req, res) {
    var userId = req.body.userId;
    var bookId = req.body.bookId;
    var text = req.body.text;
    var location = req.body.location;
    console.log('postMessage hit. userid: ' + userId);
    var payload  = {FB_id: userId, book_id:bookId, content:text, location:location, post_time:null};
    
    pool.getConnection(function(err, connection) {
        connection.query("INSERT INTO Message SET ?", payload, function(err, result) {
            if (err) {
                console.log("Error posting message... :" + err);
                res.json({status:500});
            } else {
                console.log("Message insertion successful");
                res.json({status:200});
            }
        });
        connection.release();
    });
    
}