FROM dockerfile/nodejs

ADD . /data 

WORKDIR /data/lib/tweets

RUN make deps

CMD make run-production