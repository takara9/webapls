# Build Stage
FROM node:14.16.1-alpine3.12 as build-stage

ADD vite_app2  /app
RUN addgroup -S app && adduser -S app -G app
RUN chown -R app:app /app
WORKDIR /app
USER app:app

RUN npm install
RUN npm run build


# Production Stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

