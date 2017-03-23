#!/bin/bash

# This script simplifies releasing a new Docker image of your release.
# It will run following steps:
#   1. Create git tag with version number specified in package.json
#   2. Tag Docker container that is created by build.sh script to a Docker Hub repo.
#   3. Upload changes to Docker Hub.
#
# Usage:
# ./bin/release.sh -a DOCKER_HUB_ACCOUNT_NAME [-v RELEASE_VERSION -l -f]
#   '-l' - create additional tag :latest.
#   '-f' - force tag creating when git working tree is not empty.

# Find package.json inside project tree.
# This allows to call bash scripts within any folder inside project.
PROJECT_DIR=$(git rev-parse --show-toplevel)
if [ ! -f "${PROJECT_DIR}/package.json" ]; then
    echo "[E] Can't find '${PROJECT_DIR}/package.json'"
    echo "    Check that you run this script inside git repo or init a new one in project root."
fi

# Extract project name and version from package.json
PROJECT_NAME=$(cat "${PROJECT_DIR}/package.json" \
  | grep name \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
PROJECT_VERSION=$(cat "${PROJECT_DIR}/package.json" \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
REPO_TAG=$PROJECT_VERSION

# A POSIX variable
OPTIND=1 # Reset in case getopts has been used previously in the shell.

# Default settings
IS_LATEST=0

if git diff-index --quiet HEAD --; then
  PASS_GIT=1
    # no changes
else
  PASS_GIT=0
fi

# Parse ARGS
while getopts "v:la:ft:" opt; do
  case "$opt" in
    v)  PROJECT_VERSION=$OPTARG
        ;;
    t)  REPO_TAG=$OPTARG
        ;;
    l)  IS_LATEST=1
        ;;
    f)  PASS_GIT=1
        ;;
  esac
done

# Get release notes
PREVIOUS_TAG=$(git describe HEAD^1 --abbrev=0 --tags)
GIT_HISTORY=$(git log --no-merges --format="- %s" $PREVIOUS_TAG..HEAD)

if [[ $PREVIOUS_TAG == "" ]]; then
  GIT_HISTORY=$(git log --no-merges --format="- %s")
fi;

# Create git tag that matches release version
if [ `git tag --list $PROJECT_VERSION` ]; then
  echo "[W] Git tag '${PROJECT_VERSION}' already exists. I won't be created during release."
else
  if [ ! $PASS_GIT ]; then
    echo "[E] Working tree contains uncommited changes. This may cause wrong relation between image tag and git tag."
    echo "    You can skip this check with '-f' option."
    exit 1
  else
    echo "[I] Creating git tag '${PROJECT_VERSION}'.."
    echo "    Release Notes: "
    echo $GIT_HISTORY

    git tag -a $PROJECT_VERSION -m "${GIT_HISTORY}"
  fi
fi
