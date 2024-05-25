FROM ubuntu
RUN apt-get update
RUN apt-get install -y gnupg2 curl 
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install nodejs -y
ADD ./myapp/ /myapp
RUN cd myapp && npm install
ENV NODE_ENV production
EXPOSE 3000
CMD ["node", "/myapp/bin/www"]
