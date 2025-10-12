# Web

1. Export to web.
1. Zip files

# Steam

## Setup

1. Install [Steam SDK](https://partner.steamgames.com/downloads/list)
1. Place it in `Programming/`

## Deploy

### Deploy Setup

1. Copy `*.vdf` to scripts dir.

### Deploy

1. Run `./1_setup.sh`
1. Build executables with Godot
1. Prep for upload `./2_upload_prep.sh`
1. Run one of following scripts to deploy to Steam Depots
    - Game `run_app_build ..\scripts\candlelight.vdf`
    - Playtest `run_app_build ..\scripts\candlelight_playtest.vdf`
    - Demo `run_app_build ..\scripts\candlelight_demo.vdf` 
1. Goto build page, set branch to default.
1. Publish. 
    - Make sure all changes in Steam have been published. You'll see a big red banner if not. 
    - Make sure the correct Depots are attached to the correct Application. 
    - You'll also need to restart steam after making changes and uploading and such.

Misc Notes
- [Store Beta Mode](https://store.steampowered.com/app/3157820/Candlelight/)

