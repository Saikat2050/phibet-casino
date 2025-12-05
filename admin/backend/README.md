
# PHIBET

This is our Node.js base project (Admin-end) serves as a robust foundation for developing scalable and efficient web applications. With a focus on performance and modularity, it provides essential tools and architecture, empowering developers to rapidly create and deploy feature-rich web solutions.
## Installation

- Node JS version Used is >=16.13.0 & <16.16.2

## How to run application in Dev mode (locally)
- First copy .env.sample file to .env and fill the all env variables (NODE_ENV = 'development')
- Then run `npm i` to install all the dependencies
- Run `npm run migrate` to create tables in database
- Run `npm run seed` to seed data in database
- After installing, please run `npm run start:dev`. It will start the server in watch mode

## How to run application in production mode
- First copy .env.sample file to .env and fill the all env variables  (NODE_ENV = 'producation')
- Then run `npm i` to install all the dependencies
- Run `make build` to build the project
- After installing, please run `npm run start` to start the project

## Other NPM scripts and Make Commands
- `npm run migrate:undo` to undo migrations in database
- `npm run lint` for linting of the application
- `npm run sequelize` for sequelize cli
- `npm run doc` for generating the doc of the application
- `make clean` for deleting the project build
- `make push` for push the changes to the git stream
- `make pull` for pull the latest changes from the git stream with rebase

## Features

- Content Management
- Casino Management
- Bonus Management
- Reports Management
