#!/bin/bash

TITLE="$1"

if [ ! -z $3 ]
then
  USER="--user $2"
  FILE=$3
else
  USER=""
  FILE=$2
fi

#echo $TITLE $USER $FILE $OUTPUT

grip --wide --title="${TITLE}" --user-content -b ${USER} ${FILE}
