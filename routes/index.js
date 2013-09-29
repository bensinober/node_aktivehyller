
/*
 * GET home page.
 */

module.exports.index = function(req, res){
  res.render('index', { layout: false, title: 'Aktive hyller' });
};
