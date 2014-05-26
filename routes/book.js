var db = require('../db.js');
var pool = db.dbPool;

exports.add = function(req, res) {
    var title = req.body.title;
    var author = req.body.author;
    console.log('add book hit. title: ' + title);
    var payload  = {title: title, author:author};
    
    pool.getConnection(function(err, connection) {
        connection.query("INSERT INTO Book SET ?", payload, function(err, result) {
            if (err) {
                console.log("Error adding new book... :" + err);
                res.json({status:500});
            } else {
                console.log("Successfully added a new book!");
                res.json({status:200});
            }
        });
        connection.release();
    });   
}

exports.find = function(req, res) {
    var title = req.param('title');
    // validation for categoryID
    console.log("title is : " + title);
    pool.getConnection(function(err, connection) {
       connection.query('SELECT id, author from Book where title = ?', [title], function(err, rows, fields) {
        if (err) {
            console.log("Error fetching user... :" + err);
            res.json({status:500});
        } else {
            if (rows.length > 0) {
                console.log("Got the book back, book id is " + rows[0].id);
                res.json({id: rows[0].id, author:rows[0].author});
            } else {
                res.json({});
            }
        }
      });
      connection.release(); 
    });
};

exports.fetchAll = function(req, res) {
    pool.getConnection(function(err, connection) {
       connection.query('SELECT * from Book', function(err, rows, fields) {
        if (err) {
            console.log("Error fetching books... :" + err);
            res.json({status:500});
        } else {
            if (rows.length > 0) {
                console.log("Got the books back, there are " + rows.length);
                res.json({books:rows});
            } else {
                res.json({});
            }
        }
      });
      connection.release(); 
    });
};