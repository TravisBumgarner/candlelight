# Web

1. Export to web.
1. Zip files

# Steam

A collection of notes for deploying to steam.

How to use Steam STK [Link](https://discussions.unity.com/t/solved-uploading-my-game-to-steam-from-mac/754500/25)

My version of above instructions

1. Download an install [Steam SDK](https://partner.steamgames.com/downloads/list)
1. Place it in `Programming/`
1. Run `./setup.sh`
1. Build executables with Godot
    - Mac: Extract `Candlelight.app` from `.dmg` and place in `./mac` and remove dmg.
1. `cd ~/Programming/steamworks\ sdk/tools/ContentBuilder/builder_osx`
    1. First time only
        1. `chmod +x steamcmd`
        1. Copy `candlelight.vdf` and `candlelight_demo.vdf` to scripts dir.
1. `bash ./steamcmd.sh`
1. Login with `login username password`
1. Deploy Depots
    - Run one of following scripts from within Steam shell to deploy
        - Game `run_app_build ..\scripts\candlelight.vdf`
        - Playtest `run_app_build ..\scripts\candlelight_playtest.vdf`
        - Demo `run_app_build ..\scripts\candlelight_demo.vdf`
    - Etc 
1. Goto build page, set branch to default.
1. Publish. 
    - Make sure all changes in Steam have been published. You'll see a big red banner if not. 
    - Make sure the correct Depots are attached to the correct Application. 
    - You'll also need to restart steam after making changes and uploading and such.


Misc Notes
- [Store Beta Mode](https://store.steampowered.com/app/3157820/Candlelight/)

