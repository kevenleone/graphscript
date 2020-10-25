#!bin/bash

echo "Deleting Dist Folder and generating new dist folder"
rimraf ./dist && tsc


echo "Copying ormconfig and .env files to /dist"
cp ormconfig.json .env dist/

echo "Build finished"