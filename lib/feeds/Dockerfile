FROM dockerfile/nodejs

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/project && cp -a /tmp/node_modules /opt/project
ADD . /opt/project

WORKDIR /opt/project

CMD make