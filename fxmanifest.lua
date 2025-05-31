fx_version "cerulean"
game "gta5"

title "YSeries - News App"
description "A news app for YSeries Phones"
author "TeamsGG Development"

version '1.0.0'

shared_script "config.lua"
server_script "server/*.lua"
client_script "client/*.lua"

files {
    "ui/dist/**/*",
}

ui_page "ui/dist/index.html"