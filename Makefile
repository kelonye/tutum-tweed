web:
	@$(MAKE) --no-print-directory -C lib/web

tweets:
	@$(MAKE) --no-print-directory -C lib/tweets

feeds:
	@$(MAKE) --no-print-directory -C lib/feeds

deploy:
	@$(MAKE) --no-print-directory -C lib/deploy

.PHONY: deploy feeds tweets web
