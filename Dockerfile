FROM node:14.15.1 as react-build
ARG BUILD_ENV
COPY ./ /usr/app
WORKDIR /usr/app
RUN echo "!!!!!!!!!!!!!!!!!!!!!!! $BUILD_ENV !!!!!!!!!!!!!!!!!!!!!!!!!!"
RUN yarn install --network-timeout 600000
RUN yarn run build:$BUILD_ENV

FROM nginx:1.13.9-alpine
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx
COPY --from=react-build /usr/app/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
