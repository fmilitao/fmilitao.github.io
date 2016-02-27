#!/bin/bash
TITLE=$1
USER=$2
FILE=$3

grip --wide --title="${TITLE}" --user-content -b --user ${USER} ${FILE}
