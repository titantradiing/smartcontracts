#!/bin/bash

npm run build:export

ver=`cat .version`

cd build/abi

files=($(ls *.json))

for file in "${files[@]}"; do
  # extract=(echo "${file%%.*}")
  echo "push file $file"
  s3cmd put -P $file s3://tes/$ver/$file
  s3cmd setacl s3://tes/$ver/$file --acl-public
done