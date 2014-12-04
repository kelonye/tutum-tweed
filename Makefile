web:
	@$(MAKE) --no-print-directory -C lib/web

tweets:
	@$(MAKE) --no-print-directory -C lib/tweets

feeds:
	@$(MAKE) --no-print-directory -C lib/feeds

deploy:
	@TUTUM_CLUSTER=$(TWEED_CLUSTER)\
		TUTUM_TWEED_TWITTER_CONSUMER_KEY=$(TWEED_TWITTER_CONSUMER_KEY)\
		TUTUM_TWEED_TWITTER_CONSUMER_SECRET=$(TWEED_TWITTER_CONSUMER_SECRET)\
		TUTUM_TWEED_TWITTER_ACCESS_TOKEN=$(TWEED_TWITTER_ACCESS_TOKEN)\
		TUTUM_TWEED_TWITTER_ACCESS_TOKEN_SECRET=$(TWEED_TWITTER_ACCESS_TOKEN_SECRET)\
		td up

status:
	@TUTUM_CLUSTER=$(TWEED_CLUSTER) td ps

deps:
	@$(MAKE) deps util config --no-print-directory -C lib/web -B
	@$(MAKE) deps util config --no-print-directory -C lib/tweets -B 
	@$(MAKE) deps util config --no-print-directory -C lib/feeds -B

.PHONY: deploy feeds tweets web
