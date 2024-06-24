REPO=https://github.com/louis-chevallier/running.git
DEPLOY_DIR = /deploy
WOD="$(shell fortune -s)"
start :
	echo done

deploy :
	git commit -a -m $(WOD)
	git push

	cd $(DEPLOY_DIR); rm -fr running; git clone $(REPO); cd running


