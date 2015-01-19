run:
	@$(MAKE) build
	@fig up

build:
	@$(MAKE) util config --no-print-directory -C lib/web -B
	@$(MAKE) util config --no-print-directory -C lib/tweets -B 
	@$(MAKE) util config --no-print-directory -C lib/feeds -B
	@td build

deploy:
	@$(MAKE) build push up

push:
	@td push

up:
	@td up

ps:
	@td ps

.PHONY: ps up push deploy build run
