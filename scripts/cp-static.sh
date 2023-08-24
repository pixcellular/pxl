#!/usr/bin/env bash

# copy package relevant static files to dist:
cp -r \
  package.json \
  .npmignore \
  jest.config.js \
  src \
  tests \
  README.md \
  LICENSE.md \
  CONTRIBUTING.md \
  CODE_OF_CONDUCT.md \
  dist
