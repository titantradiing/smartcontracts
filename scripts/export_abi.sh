#!/bin/bash

cd build

mkdir -p abi
files=($(ls *.json))

for file in "${files[@]}"; do
  # extract=(echo "${file%%.*}")
  echo "extract file $file"
  cat $file | jq -rc '.abi' > ./abi/$file
done