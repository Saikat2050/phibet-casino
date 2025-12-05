SHELL := /bin/bash

# Define project name for docker-compose
PROJECT_NAME := phibet

# HELP
.PHONY: help

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# DOCKER TASKS
wipe-all: down wipe-volumes wipe-images remove-containers ## Remove images, containers, and wipe volumes used by it

down: ## Stop and remove containers
	@docker-compose --project-name $(PROJECT_NAME) down
	@docker-compose --project-name $(PROJECT_NAME) kill
	@make remove_stopped_containers

remove_stopped_containers: ## Remove stopped containers
	@docker-compose --project-name $(PROJECT_NAME) rm -vfs

wipe-volumes: ## Free up the volume
	@sudo rm -rf docker_volumes_data
	@if [[ -n "$$(docker volume ls -qf dangling=true)" ]]; then\
		docker volume rm -f $$(docker volume ls -qf dangling=true);\
	fi
	@docker volume ls -qf dangling=true | xargs -r docker volume rm

wipe-images: ## Remove images
	@if [[ -n "$$(docker images --filter "dangling=true" -q --no-trunc)" ]]; then\
		docker rmi -f $$(docker images --filter "dangling=true" -q --no-trunc);\
	fi
	@if [[ -n "$$(docker images | grep "none" | awk '/ / { print $3 }')" ]]; then\
		docker rmi -f $$(docker images | grep "none" | awk '/ / { print $3 }');\
	fi

install-docker:
	@echo "Installing Docker"
	@sudo apt-get update
	@sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
	@curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
	@sudo add-apt-repository \
		"deb [arch=amd64] https://download.docker.com/linux/ubuntu $$(lsb_release -cs) stable"
	@sudo apt-get update
	@sudo apt-get --yes --no-install-recommends install docker-ce
	@sudo usermod --append --groups docker "$$USER"
	@sudo systemctl enable docker
	@echo "Waiting for Docker to start..."
	@sleep 3
	@sudo curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
	@sudo chmod +x /usr/local/bin/docker-compose
	@sleep 5
	@echo "Docker Installed successfully"

install-docker-if-not-already-installed:
	@if [ -z "$$(which docker)" ]; then\
		make install-docker;\
	fi

build-all-docker-images: ## build all docker images
	@echo "Building docker images."
	@echo "Grab a coffee and wait."
	@docker-compose --project-name $(PROJECT_NAME) build --force-rm
	@echo "Docker images built"

dirty-up: check-and-create-network ## run docker images without re-building
	@docker-compose --project-name $(PROJECT_NAME) up -dV

up: check-and-create-network ## run docker images with building
	@docker-compose --project-name $(PROJECT_NAME) up -dV --build

# DATABASE TASKS
set-up-db: ## setup db
	@echo 'Running database setup for service '$*
	@docker-compose --project-name $(PROJECT_NAME) run --rm $* admin-backend npm run init && exit 0
	@echo 'Completed database setup for service '$*

reset-db: ## reset db
	@echo 'Running reset database for service '$*
	@docker-compose --project-name $(PROJECT_NAME) run --rm $* admin-backend npm run reset && exit 0
	@echo 'Completed database reset for service '$*

run-db-migrations:
	@echo 'Running database pending migrations'
	@docker-compose --project-name $(PROJECT_NAME) run --rm admin-backend npm run migrate

run-db-seeder:
	@echo 'Running database pending seeders'
	@docker-compose --project-name $(PROJECT_NAME) run --rm admin-backend npm run seed

psql-database: ## connect to psql console
	@docker-compose --project-name $(PROJECT_NAME) exec database psql -U postgres 

	
run-build: check-and-create-network ## Build and run containers with a custom name
		@docker-compose -p $(PROJECT_NAME) up -dV --build $(filter-out $@,$(MAKECMDGOALS))

# NETWORK TASK
check-and-create-network: ## Create a network
	@docker network ls | grep phibet > /dev/null || docker network create phibet

# GIT TASKS
pull: ## Pull the current branch
	@git pull origin $$(git branch | grep \* | cut -d ' ' -f2) --rebase

push: ## Push the current branch
	@git push origin $$(git branch | grep \* | cut -d ' ' -f2) --force-with-lease

commit-message: ## Committing the current branch ex: make commit message ---> git commit -m "BRANCH_NAME: message"
	git commit -m "$$(git branch | grep \* | cut -d ' ' -f2): $(filter-out $@,$(MAKECMDGOALS))"

set-up: install-docker-if-not-already-installed check-and-create-network down build-all-docker-images set-up-db

reset-up: install-docker-if-not-already-installed check-and-create-network down build-all-docker-images reset-db

reset: wipe-all check-and-create-network reset-up down

%:
	@:
