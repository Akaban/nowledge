#!/bin/bash

SCRIPT=`realpath $0`
SCRIPTPATH=`dirname $SCRIPT`

DEPENDENCY_DIR="dependencies"
DEPENDENCY_NAME="react-pdf-highlighter"
DEPENDENCY_TGZ_DIR="tgz_dependencies"

cd $DEPENDENCY_DIR/$DEPENDENCY_NAME/packages/$DEPENDENCY_NAME && npm run build && npm pack && cp *.tgz $SCRIPTPATH/$DEPENDENCY_TGZ_DIR      
