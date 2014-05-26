var mysql = require('mysql');

var pool = mysql.createPool({
  host     : 'us-cdbr-east-05.cleardb.net',
  user     : 'b6fdf18b32b888',
  password : '16b0039e',
  database : 'heroku_4e06a68899fb896'
});

module.exports = {
  dbPool: pool  
};