#!/bin/bash

if [ $# -gt 0 ]; then
    echo "if this ends with an error, you have to pip install meltano"
    meltano add extractor tap-csv --variant=meltanolabs
    meltano add loader target-jsonl

else
    echo "Hopefully you run ./process.sh 0 first."
    rm "./src/lib/store/*.jsonl"
    meltano run tap-csv target-jsonl
    for file in ./src/lib/store/*.jsonl; do
        cat $file | jq -s '.' > ${file::-1}
        rm $file
    done
fi