#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: ./replace_placeholders.sh <title> <url>"
  exit 1
fi

title="$1"
url="$2"
export LC_CTYPE=C

find . \( -path './.*' -o -path './node_modules' \) -type d -prune -o -type f -exec sed -i '' \
  -e "s/REPLACE_TITLE/${title//\//\\/}/g" \
  -e "s/REPLACE_URL/${url//\//\\/}/g" {} +

rm replace_placeholders.sh