#!/usr/bin/env bash
set -xe
npm run build
npm t
cd examples/herbivore/
pwd
npm run build
cd ../conway
pwd
npm run build