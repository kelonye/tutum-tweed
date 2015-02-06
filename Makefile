run:
	@$(MAKE) build
	@fig up

run-production:
	@$(MAKE) util config --no-print-directory -C lib/web -B
	@$(MAKE) util config --no-print-directory -C lib/tweets -B 
	@$(MAKE) util config --no-print-directory -C lib/feeds -B
	@fig build
	@fig up -d

build:
	@$(MAKE) util config --no-print-directory -C lib/web -B
	@$(MAKE) util config --no-print-directory -C lib/tweets -B 
	@$(MAKE) util config --no-print-directory -C lib/feeds -B
	@td build

up:
	@$(MAKE) build
	@td push
	@td up

deploy:
	@git push origin master | echo
	@ansible-playbook -i bin/ansible/inventories/production bin/ansible/up.yml

ssh:
	@ssh root@178.62.234.105

.PHONY: ssh deploy up build run-production run
