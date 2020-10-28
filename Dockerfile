FROM node:12 AS build

ARG NPM_AUTH_TOKEN

RUN mkdir -p /app
ADD . /app

RUN echo "//npm.pkg.github.com/:_authToken=$NPM_AUTH_TOKEN" > /root/.npmrc
WORKDIR /app
RUN yarn
RUN rm -f /root/.npmrc

FROM node:12 AS run

COPY --from=build /app /app
WORKDIR /app
CMD ["sh", "-c", "sed -i \"s/localhost:8080/$BACKEND_HOST:8080/g\" /app/webpack.config.js ; yarn run server"]

EXPOSE 3000
