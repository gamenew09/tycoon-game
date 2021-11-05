# Tycoon Game
After seeing some people make a Tycoon game with Typescript and Flamework. I wanted to have my go at it!

This game is not pretty, but I do want to make something out of this. I am making this open source. Maybe you can learn a few things from what I've done!

## Play the Game
Right now you'll have to build the place file to play it. Eventually, I'll publish this.

## Getting Started
 
 1. *Run `npm install`.* This will install all requirements for the game and npm scripts to work properly.
 2. *Build a place file.* By running `npm run build`, you create a place file that you can then open up. The place will contain all of the assets baked in. At this point, you can just hit Play and it'll work.
 3. To work on the game while you have the place file open, run `npm run watch`. This will start up `rojo` (syncs roblox models & scripts from the filesystem) and `rbxtsc -w` (transpiles typescript into Roblox Luau).