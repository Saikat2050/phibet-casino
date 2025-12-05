## --------- for development ---------
FROM node:20-alpine AS builder


RUN apk update
RUN apk add --no-cache python3 make g++


WORKDIR /home/node/app


# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run

ARG NODE_ENV=production
# ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV
ENV NODE_OPTIONS --max_old_space_size=2096

ARG PORT=8080
ENV PORT $PORT
EXPOSE $PORT 9240 9241


# set DEBIAN_FRONTEND to noninteractive.
ENV DEBIAN_FRONTEND noninteractive


# install dependencies first, in a different location for easier app bind mounting for local development


COPY ./package*.json ./
RUN yarn global add pnpm

RUN pnpm install


# copy in our source code last, as it changes the most
COPY . .


RUN yarn build


## --------- for production deployment ---------
FROM nginx:stable AS production
WORKDIR /usr/share/nginx/html
EXPOSE 80
COPY --from=builder /home/node/app/build /usr/share/nginx/html
COPY --from=builder /home/node/app/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]