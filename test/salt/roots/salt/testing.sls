##########
# PACKAGES
##########

nodejs:
  pkgrepo.managed:
    - ppa: chris-lea/node.js
    - require_in: nodejs

casperjs:
  pkgrepo.managed:
    - ppa: stephane-brunner/raring
    - require_in: phantomjs
    - require_in: casperjs

installpkgs:
  pkg.latest:
    - pkgs:
      - git
      - openssh-server
      - python-software-properties
      - software-properties-common
      - nodejs
      - casperjs
      - phantomjs
    - skip_verify: True
    - require:
      - pkgrepo: nodejs

########
# USERS
########

aktivuser:
  user.present:
    - name: aktiv
    - fullname: Aktivehyller
    - shell: /bin/bash
    - home: /home/aktiv
    - password: $6$SALTsalt$p9Pw3iiRbVgdeYPpDZ.dQIwITJbO6jkCrzdtKKF8HY2hliWCI7JzT/ErezDHlBBYQN/cvImLvMNMCl1ab1xDt.
    - groups:
      - dialout
      - adm
      - users
      - plugdev
      - sudo

########
# GIT
########

https://github.com/digibib/node_aktivehyller.git:
  git.latest:
  - rev: develop
  - target: /home/aktiv/code/node_aktivehyller
  - force: True
  - require:
    - user: aktiv
    - pkg: installpkgs

##########
# DEPENDENCIES
##########

npm_install:
  cmd.run:
    - name: HOME=/home/aktiv npm install > npminstall.txt
    - cwd: /home/aktiv/code/node_aktivehyller
    - stateful: True
    - require:
      - pkg: installpkgs
      - git: https://github.com/digibib/node_aktivehyller.git

########
# LOCAL SETTINGS
########

/home/aktiv/code/node_aktivehyller/config/settings.json:
  file.symlink:
    - target: /home/aktiv/code/node_aktivehyller/config/example.settings.json
    - user: aktiv
    - group: aktiv

/home/aktiv/code:
  file.directory:
    - user: aktiv
    - group: aktiv
    - makedirs: True
    - recurse:
      - user
      - group

##########
# SERVICES
##########

aktivehyller:
  cmd.run:
    - name: ./integration.sh > test/integrationtest.out
    - cwd: /home/aktiv/code/node_aktivehyller
    - require:
      - pkg: installpkgs
      - git: https://github.com/digibib/node_aktivehyller.git
