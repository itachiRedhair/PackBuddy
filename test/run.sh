#!/bin/bash
for file in events/*.json; do
    lambda-local -l ../index.js -h handler -e $file
done