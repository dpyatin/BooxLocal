
/*
 * GET home page.
 */

exports.index = function(req, res){
  var FBID = 0;

  if (typeof req.session.FBID !== 'undefined') {
    FBID = req.session.FBID;
  }

  res.render('index', { title: 'Express', FBID: FBID });
};
