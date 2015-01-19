run:
	@NODE_PATH=$NODE_PATH:. DEBUG=app:* node bin/build
	@NODE_PATH=$NODE_PATH:. DEBUG=app:* ./node_modules/.bin/supervisor -q -x node bin/run

util:
	@rm -rf $@
	@cp -r ../$@ $@/

config:
	@rm -rf $@
	@cp -r ../$@ $@/

.PHONY: config util run
