FROM --platform=linux/amd64 public.ecr.aws/h7c8h6j2/docker-images:node-20-alpine AS builder

# install dependecies
RUN apk update
RUN apk add --no-cache python3 make g++

RUN mkdir -p /home/node/app && chown node:node /home/node/app

USER node

WORKDIR /home/node/app

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV


# set DEBIAN_FRONTEND to noninteractive.
ENV DEBIAN_FRONTEND noninteractive

# default to port 80 for node, and 9229 and 9230 (tests) for debug
ARG PORT=80
ENV PORT $PORT
EXPOSE $PORT

# install dependencies first, in a different location for easier app bind mounting for local development

COPY ./package*.json ./
RUN npm install

# copy in our source code last, as it changes the most
COPY . .

RUN make build

# RUN npm prune --production

FROM --platform=linux/amd64 public.ecr.aws/h7c8h6j2/docker-images:node-20-alpine AS production

RUN mkdir -p /home/node/app && chown node:node /home/node/app

USER node

WORKDIR /home/node/app

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

COPY --from=builder /home/node/app/package*.json ./
COPY --from=builder /home/node/app/node_modules ./node_modules/
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/Makefile ./
COPY --from=builder /home/node/app/.sequelizerc ./

CMD ["npm", "run", "start"]
