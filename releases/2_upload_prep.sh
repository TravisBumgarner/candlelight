cd ~/Programming/steamworks\ sdk/tools/ContentBuilder/content

set -e

tmp=$(mktemp -d)
hdiutil attach ./mac/index.dmg -mountpoint "$tmp" -nobrowse -quiet
ditto "$tmp"/*.app ./mac/Candlelight.app
hdiutil detach "$tmp" -quiet
rmdir "$tmp"

cd ~/Programming/steamworks\ sdk/tools/ContentBuilder/builder_osx
chmod +x steamcmd.sh
bash ./steamcmd.sh +login sillysideprojects