
/*
 * GET home page.
 */

exports.index = function(req, res){
  var session = require('../app').session; // Inherit session
  // clear history
  session.history = [];
  session.current = null;
  session.log = {start: "starting", stop: null, rfid: 0, omtale: 0, flere: 0, relaterte: 0};
  res.render('index', { layout: false, title: 'Aktive hyller', path: req.path, session: session });
};
