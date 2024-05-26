FROM golang:1.9.2

RUN rm -fr $GOPATH
RUN git clone https://github.com/takara9/go_webpages --recursive $GOPATH
WORKDIR $GOPATH
RUN go get github.com/tools/godep
RUN godep restore
RUN go install github.com/takara9/go_webserver2

EXPOSE 4040
ENTRYPOINT ["bin/go_webserver2"]



