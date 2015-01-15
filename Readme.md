Tweed
===

This is a demo of easy deployment of a simple node.js application using [Tutum](http://tutum.co) on [Digital Ocean](http://digitalocean.com). The application is a simple feeds and tweets aggregator for popular tech news sites. Improvements welcomed!

![](https://dl.dropbox.com/u/30162278/tweed.png)

![](https://dl.dropbox.com/u/30162278/tweed-drawer.png)

#### Deploying

- Sign up at [Tutum.co](http://tutum.co)
- Log into Tutum
- Click on the menu on the upper right corner of the screen
- Select Account info
- Select Api Key
- Create new twitter app
- Set the following env vars appropriately:
  - TUTUM_USER
  - TUTUM_APIKEY
  - TWEED_CLUSTER # the cluster name
  - TWEED_TWITTER_CONSUMER_KEY
  - TWEED_TWITTER_CONSUMER_SECRET
  - TWEED_TWITTER_ACCESS_TOKEN
  - TWEED_TWITTER_ACCESS_TOKEN_SECRET
- Install [tutum-deploy](https://github.com/kelonye/node-tutum-deploy) with:
    
    $ npm install -g tutum-deploy

Or

    $ docker install kelonye/tutum-deploy
    $ alias td=$(docker run kelonye/tutum-deploy -v .:/opt/app)

- Run `make deploy` to deploy the services
- Go to https://dashboard.tutum.co/node/cluster/list
- Select your new cluster and use the provided hostname to access the app

#### Running locally

- Copy `fig.sample.yml` to `fig.yml`
- Fill in the corresponding Twitter app credentials in `fig.yml`
- Also replace the image username namespace, `[user]` to tutum's
- Run `make`
- Visit app on port `5000`

#### Licence

  MIT
