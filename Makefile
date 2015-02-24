REPORTER = spec

test:
	@NODE_ENV=test mocha \
		--reporter $(REPORTER) \

test-w:
	@NODE_ENV=test mocha \
		--reporter $(REPORTER) \
		--growl \
		--watch

cover:
	@NODE_ENV=test istanbul cover \
		node_modules/.bin/_mocha -- -- -u exports \
		--reporter $(REPORTER) test/*.js

todo:
	@grep -rn TODO *.js ./lib/*.js ./views/*.ejs ./public/js/*.js || true

.PHONY: test test-w
