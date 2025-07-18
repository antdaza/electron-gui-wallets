#!/bin/bash

# This script needs to run on an *actual* Mac with proper signing keys loaded.  It won't work in CI
# because Apple codesigning is unbelievably flakey.

rm -f bin/antd*

./tools/download-antd-files.sh https://antd.rocks/antd-io/antd-core/antd-stable-macos-LATEST.tar.xz

export NODE_OPTIONS=--openssl-legacy-provider

npm run build
