# Active Shelves

Active Shelves rewritten in Node.js

## Prerequisites

Requires Node.js 

## (L)ubuntu Install

### Node.js

```
sudo apt-get update
sudo apt-get install python-software-properties software-properties-common python g++ make
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
```

### Mocha (testing)

```
sudo npm install -g mocha
sudo apt-get install libnotify-bin
```

## Deploy scripts

SaltStack setup and deploy scripts are under `salt`

All neccessary files under `salt/files`

## Manual install

Install required modules:

```npm install``` from root application folder


## Integration tests

requires phantomjs and casperjs
both can be downloaded and installed manually

## Vagrant

Read about deploy in `deploy/README.md`
