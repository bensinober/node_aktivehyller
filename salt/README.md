# Aktive Shelves Deploy

This folder includes deploy scripts for the active shelves

## Vagrant

Vagrant is a Ruby framework to automate deploy to virtual images. 
Vagrant takes :
* a `Vagrantfile` that describes the virtual image, ports and settings for Virtualbox
* a `salt` config that describes the packages, files and dependencies needed to setup the App
  * the salt config file `init.sls` can further be used to deploy directly to staging and production  

## folders 

```
deploy/
├── README.md
├── salt                      (configuration files for deployment with SaltStack)
│   ├── init.sls
│   ├── minion.conf
│   ├── node_aktivehyller
│   │   └── deploy
│   │       └── salt
│   │           └── files     (local files to project deploy)
│   │               ├── aktivehyller.conf
│   │               ├── aktivehyller-cronjobs
│   │               ├── aktivehyller.desktop
│   │               ├── aktivehyller.sh
│   │               ├── aktivhylle.json
│   │               ├── lightdm.conf
│   │               ├── lightdm-restart.sh
│   │               ├── log2sql.sh
│   │               ├── stats.rb
│   │               ├── xscreensaver-timeout.desktop
│   │               └── xscreensaver-timeout.sh
│   └── top.sls
└── Vagrantfile
```