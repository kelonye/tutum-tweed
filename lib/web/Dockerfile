FROM dockerfile/nodejs

ADD . /data 

WORKDIR /data/lib/web

RUN make deps build

EXPOSE 80

CMD make run-production