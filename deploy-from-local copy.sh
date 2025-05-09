#!/bin/bash

git pull github main
git push b03.prod.git master:main

ssh -t b03-prod-git "./react-telegram-deck/build.sh"


