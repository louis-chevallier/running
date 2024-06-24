REPO=https://github.com/louis-chevallier/running.git
DEPLOY_DIR = /deploy

start :
	echo done

deploy :
	cd $(DEPLOY_DIR); rm -fr running; git clone $(REPO); cd running


