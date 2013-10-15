#!/bin/bash
NODE_ENV=test node app.js > /dev/null & echo $! > ah.pid
sleep 1
casperjs test test/integration/browser_tests.js
kill $(cat ah.pid)
rm ah.pid