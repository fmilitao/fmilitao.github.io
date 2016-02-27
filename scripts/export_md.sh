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

OUTPUT="${FILE%.md}.html"

#echo $TITLE $USER $FILE $OUTPUT

grip --wide --title="${TITLE}" --user-content --export ${USER} ${FILE}

echo "Cleaning ${OUTPUT} file"
sed -i .bak  's/.discussion-timeline::before{position:absolute;top:0;bottom:0;left:79px;z-index:-1;display:block;width:2px;content:"";background-color:#f3f3f3}/.discussion-timeline::before{position:absolute;top:0;bottom:0;left:79px;z-index:-1;display:block;width:2px;content:"";}/g' ${OUTPUT}
