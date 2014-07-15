#!/bin/bash -ex
EXEC_DIR=`dirname $0`
WORK_DIR=`pwd`
cd $EXEC_DIR
cd ..
gulp nfo --dir=$WORK_DIR
cd -
