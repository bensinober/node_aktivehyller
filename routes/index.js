
/*
 * GET home page.
 */

exports.index = function(req, res){
  var Rfidgeek = require('rfidgeek');
  var rfid = new Rfidgeek();
  res.render('index', { rfid: rfid, title: 'Aktive hyller' });
};
