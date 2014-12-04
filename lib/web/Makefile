run: node_modules util config
	@$(MAKE) --no-print-directory -C lib/client -B
	@NODE_PATH=$NODE_PATH:. DEBUG=app:* ./node_modules/.bin/supervisor -q -w lib/server -e 'js' -x node bin/run

run-production:
	@NODE_PATH=$NODE_PATH:. DEBUG=app:* NODE_ENV='production' ./node_modules/.bin/supervisor -q -w lib/server -e 'js' -x node bin/run

util:
	@rm -rf $@
	@cp -r ../$@ $@/

config:
	@rm -rf $@
	@cp -r ../$@ $@/

build: node_modules
	@NODE_PATH=$NODE_PATH:. MINIFY=1 DEBUG=app:* node bin/build

deps: node_modules

node_modules:
	@npm install

.PHONY: deps config util run
