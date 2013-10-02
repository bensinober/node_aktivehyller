casper.test.begin('Mens vi venter', 4, function suite(test) {
  var aktivHylle = "http://localhost:4567";

  casper.start(aktivHylle, function() {
    test.assertHttpStatus(200, "http status OK");
  });

  casper.thenOpen(aktivHylle+"/check/974232", function() {
    test.assertHttpStatus(200, "http status OK");
    res = JSON.parse(this.getPageContent());
    test.assertEquals(res.title, 'Morgen i Jenin');
    test.assertEquals(res.valid, true);
  });

  casper.run(function() {
    test.done();
  })
});