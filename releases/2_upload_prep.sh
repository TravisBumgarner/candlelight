cd ~/Programming/steamworks\ sdk/tools/ContentBuilder/content

set -e

tmp=$(mktemp -d)
hdiutil attach ./mac/index.dmg -mountpoint "$tmp" -nobrowse -quiet
ditto "$tmp"/*.app ./mac/Candlelight.app
hdiutil detach "$tmp" -quiet
rmdir "$tmp"

cd ~/Programming/steamworks\ sdk/tools/ContentBuilder/builder_osx
chmod +x steamcmd.sh

echo "Run one of"
echo "    - Game `run_app_build ..\scripts\candlelight.vdf`"
echo "    - Playtest `run_app_build ..\scripts\candlelight_playtest.vdf`"
echo "    - Demo `run_app_build ..\scripts\candlelight_demo.vdf`" 

bash ./steamcmd.sh +login sillysideprojects