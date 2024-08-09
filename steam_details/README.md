# Readme

A collection of notes for deploying to steam.

How to use Steam STK [Link](https://discussions.unity.com/t/solved-uploading-my-game-to-steam-from-mac/754500/25)

My version of above instructions

1. Download an install [Steam SDK](https://partner.steamgames.com/downloads/list)
2. Place it in `Programming/`
3. `cd sdk/tools/ContentBuilder/builder_osx/`
4. `chmod +x steamcmd`
5. `bash ./steamcmd.sh`
6. Login with `login username password`
7. Copy `candlelight.vdf` to scripts dir.
8. Build exeutables with Godot with installers in dirs `windows/` `mac/` `linux/`
    - Installers should be Candlelight.[extension]
9. Make sure all changes in Steam have been published. You'll see a big red banner if not. 
    - Make sure the correct Depots are attached to the correct Application. 
    - You'll also need to restart steam after making changes and uploading and such.
9. `run_app_build ..\scripts\candlelight.vdf` from within the Steam shell.
10. Goto build page, set branch to default.
11. Publish. 


Misc Notes
- [Store Beta Mode](https://store.steampowered.com/app/3157820/Candlelight/)

