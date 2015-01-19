FROM dockerfile/nodejs

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/project && cp -a /tmp/node_modules /opt/project
ADD lib/client/component.json /tmp/component.json
RUN cd /tmp/ && node /tmp/node_modules/component-hooks/node_modules/.bin/component install
RUN mkdir -p /opt/project/lib/client/ && cp -a /tmp/components /opt/project/lib/client/
ADD . /opt/project

WORKDIR /opt/project

EXPOSE 80

CMD make