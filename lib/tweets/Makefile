run: node_modules
	@NODE_PATH=$NODE_PATH:.. DEBUG=app:* ./node_modules/.bin/supervisor -q -w lib -e 'js' -x node bin/run

run-production:
	@NODE_PATH=$NODE_PATH:.. DEBUG=app:* NODE_ENV='production' ./node_modules/.bin/supervisor -q -w lib -e 'js' -x node bin/run

deps: node_modules

node_modules:
	@npm install

.PHONY: deps run
