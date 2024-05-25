FROM ubuntu:20.04
RUN apt update && apt install -y curl git vim
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt install -y nodejs=16.17.0-deb-1nodesource1
RUN git clone https://github.com/takara9/webapl-20-spa
RUN cd webapl-20-spa && npm install
RUN npm install -g @angular/cli@12.2.0
WORKDIR /webapl-20-spa
CMD ["ng","serve","--host","0.0.0.0"]


