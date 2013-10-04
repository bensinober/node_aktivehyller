#!/bin/bash
CHROMIUM=/usr/bin/chromium-browser
CHROMIUMPREFS=~/.config/chromium

while true
do
  #rm -rf \$CHROMIUMPREFS/Singleton*
  $CHROMIUM --kiosk --disable-restore-session-state --child-clean-exit http://localhost:4567
  sleep 3
done
