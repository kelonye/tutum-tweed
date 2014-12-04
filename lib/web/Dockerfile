FROM dockerfile/nodejs

ADD . /data 

WORKDIR /data

RUN make deps build

EXPOSE 80

CMD make run-production