FROM        dockerfile/ubuntu
WORKDIR     /opt
RUN         apt-get update
RUN         apt-get install -y make wget
RUN         wget https://github.com/antirez/redis/archive/3.0.0-rc1.tar.gz
RUN         tar xzf 3.0.0-rc1.tar.gz
RUN         rm -f 3.0.0-rc1.tar.gz
WORKDIR     redis-3.0.0-rc1
RUN         make
EXPOSE      6379
ADD         . /opt
CMD         src/redis-server ../redis.conf