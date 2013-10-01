all: lint test coverage

clean:
	@rm -f coverage.html
	@rm -rf lib-cov

lint:
	@node_modules/grunt-cli/bin/grunt jshint

test:
	@node_modules/mocha/bin/mocha

coverage:
	@rm -rf lib-cov
	@jscoverage lib lib-cov
	@SAUCELABS_COV=1 node_modules/mocha/bin/mocha --reporter html-cov > coverage.html

.PHONY: clean lint test coverage