set -ex

git pull


version=`cat VERSION`
echo "version: $version"
#set version number in .env
#sed -i "s/^APP_VERSION.*/APP_VERSION = "\"$version"\"/" .env

#cat .env

# tag it
git add -A
git commit -m "version $version"
git tag -a "$version" -m "version $version"
git push
git push --tags
