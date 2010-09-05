# lulzbot
Lulzbot is an IRC bot that runs on node.js, and lives in #stackvm.

# dependencies

* [node.js](http://nodejs.org) (of course)
* [node-github](http://github.com/ajaxorg/node-github) (in lib/)
* [node-irc](http://github.com/martynsmith/node-irc) (in lib/)
* [DNode](http://github.com/substack/dnode) and its dependencies (via npm)
* [yql](http://github.com/drgath/node-yql) (via npm)


# commands

* **!weather** (or !wx) *search* : what's the weather?
* **!source**: lists lulzbot's source's url for the active branch
* **!onscreen**: prints out some kinda Klingon spaceship
* **!lns**: Shortens urls using ln-s.net

# services

* **gitwatch** watches github repos as listed in gitwatch.json.

# future

* **twitterwatch** to watch twitter for mentions of stackvm
* **persistence** to save settings between restarts, probably with nStore
