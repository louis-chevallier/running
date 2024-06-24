REPO=https://github.com/louis-chevallier/running.git

start :
	echo done

deploy :
	cd $(DEPLOY_DIR); rm -fr running; git clone $(REPO); cd running


