run:
	@fig build
	@fig up

web:
	@$(MAKE) --no-print-directory -C lib/web

tweets:
	@$(MAKE) --no-print-directory -C lib/tweets

feeds:
	@$(MAKE) --no-print-directory -C lib/feeds

deploy:
	@$(MAKE) build push up

build:
	@td build

push:
	@td push

up:
	@td up

ps:
	@td ps

deps:
	@$(MAKE) deps util config --no-print-directory -C lib/web -B
	@$(MAKE) deps util config --no-print-directory -C lib/tweets -B 
	@$(MAKE) deps util config --no-print-directory -C lib/feeds -B

.PHONY: deps ps up push build deploy feeds tweets web run
