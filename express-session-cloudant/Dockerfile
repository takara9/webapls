FROM ubuntu
RUN apt-get update
RUN apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup_6.x | /bin/bash -
RUN apt-get install nodejs -y
ADD . /app
ENV NODE_ENV production
EXPOSE 3000
CMD ["node", "/app/bin/www"]
