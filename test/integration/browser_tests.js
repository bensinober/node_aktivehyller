var aktivHylle = "http://localhost:4567";
var casper = require('casper').create(
  {viewportSize: {width: 1680, height: 1050}
});

casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
});

casper.start(aktivHylle+"/", function() {
  this.test.assertHttpStatus(200, "http status OK");
  this.test.assertTitle("Aktive hyller", 'Title matches');
})

casper.thenOpen(aktivHylle+"/check/974232", function() {
  this.test.assertHttpStatus(200, "http status OK");
  res = JSON.parse(this.getPageContent());
  this.test.assertEquals(res.title, 'Morgen i Jenin');
  this.test.assertEquals(res.valid, true);
});

casper.thenOpen(aktivHylle+"/check/1031239", function() {
  res = JSON.parse(this.getPageContent());
  this.test.assertEquals(res.valid, false);
});

casper.run(function() {
  this.test.done();
  this.exit();
})