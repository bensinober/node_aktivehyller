#!/bin/bash

trap "" SIGHUP SIGINT SIGTERM
PATH=$PATH:/sbin:/usr/sbin
service lightdm restart 