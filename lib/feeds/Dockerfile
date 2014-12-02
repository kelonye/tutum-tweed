FROM dockerfile/nodejs

ADD . /data 

WORKDIR /data/lib/feeds

RUN make deps

CMD make run-production