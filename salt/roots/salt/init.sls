##########
# PACKAGES
##########

nodejs:
  pkgrepo.managed:
    - ppa: chris-lea/node.js
    - require_in: nodejs

removepkgs:
  pkg.purged:
    - pkgs:
      - abiword
      - firefox
      - sylpheed
      - apport
      - pidgin
      - transmission
      - gnumeric
      - xfburn
      - mtpaint
      - simple-scan

installpkgs:
  pkg.latest:
    - pkgs:
      - git
      - chromium-browser
      - build-essential
      - curl
      - imagemagick
      - screen
      - vino
      - libav-tools
      - sqlite3
      - libsqlite3-dev
      - openssh-server
      - python-software-properties
      - software-properties-common
      - nodejs
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
# GLOBAL SETTINGS
########

/etc/init/aktivehyller.conf:
  file.managed:
    - source: salt://files/aktivehyller.conf
    - source: salt://node_aktivehyller/salt/roots/salt/files/aktivehyller.conf

/etc/chromium-browser/policies/managed/aktivhylle.json:
    file.managed:
    - source: salt://files/aktivhylle.json
    - source: salt://node_aktivehyller/salt/roots/salt/files/aktivhylle.json

/etc/lightdm/lightdm.conf:
    file.managed:
    - source: salt://files/lightdm.conf
    - source: salt://node_aktivehyller/salt/roots/salt/files/lightdm.conf

/etc/lightdm/lightdm-restart.sh:
    file.managed:
    - source: salt://files/lightdm-restart.sh
    - source: salt://node_aktivehyller/salt/roots/salt/files/lightdm-restart.sh
    - mode: 0755

########
# LOCAL SETTINGS
########

/home/aktiv/code/node_aktivehyller/config/settings.json:
  file.symlink:
    - target: /home/aktiv/code/node_aktivehyller/config/example.settings.json
    - user: aktiv
    - group: aktiv

/home/aktiv/code/node_aktivehyller/public/images/startscreen.png:
  file.managed:
    - source: salt://files/startscreen.png
    - source: salt://node_aktivehyller/salt/roots/salt/files/startscreen.png

/home/aktiv/code/node_aktivehyller/public/images/leftbar.png:
  file.managed:
    - source: salt://files/leftbar.png
    - source: salt://node_aktivehyller/salt/roots/salt/files/leftbar.png

/home/aktiv/code:
  file.directory:
    - user: aktiv
    - group: aktiv
    - makedirs: True
    - recurse:
      - user
      - group

/home/aktiv/.config/autostart:
  file.directory:
    - user: aktiv
    - group: aktiv
    - makedirs: True

/home/aktiv/.config/autostart/aktivehyller.desktop:
  file.managed:
    - source: salt://files/aktivehyller.desktop
    - source: salt://node_aktivehyller/salt/roots/salt/files/aktivehyller.desktop
    - require:
      - file: /home/aktiv/.config/autostart

/home/aktiv/.config/autostart/xscreensaver-timeout.desktop:
    file.managed:
    - source: salt://files/xscreensaver-timeout.desktop
    - source: salt://node_aktivehyller/salt/roots/salt/files/xscreensaver-timeout.desktop
    - require:
      - file: /home/aktiv/.config/autostart

##########
# SERVICES
##########

aktivehyller:
  service:
    - running
    - enable: True
    - user: aktiv
    - require:
      - file: /etc/init/aktivehyller.conf
      - file: /home/aktiv/code/node_aktivehyller/config/settings.json
    - watch:
      - git: https://github.com/digibib/node_aktivehyller.git

lightdm:
  service:
    - running
    - watch:
      - service: aktivehyller
    - stateful: True

kill_aktivehyller:
  cmd.run:
    - name: pkill aktivehyller*
    - watch:
      - service: aktivehyller

kill_xscreensaver-timeout:
  cmd.run:
    - name: killall xscreensaver-timeout.sh
    - watch:
      - service: aktivehyller