FROM dockerfile/nodejs

ADD . /data 

WORKDIR /data

RUN make deps

CMD make run-production