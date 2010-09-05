# lulzbot
Lulzbot is an IRC bot that runs on node.js, and lives in #stackvm.

# dependencies

* [node.js](http://nodejs.org) (of course)
* [node-github](http://github.com/ajaxorg/node-github) (in lib/)
* [node-irc](http://github.com/martynsmith/node-irc) (in lib/)
* [DNode](http://github.com/substack/dnode) and its dependencies (via NPM)


# commands

* **!weather** (or !wx) *search* : what's the weather?
* **!source**: lists lulzbot's source's url for the active branch
* **!onscreen**: prints out some kinda Klingon spaceship

# services

* **gitwatch** watches github repos as listed in gitwatch.json.

# future

* **twitterwatch** to watch twitter for mentions of stackvm
* **!ln-s** or something similar to shorten urls
* **persistence** to save settings between restarts, probably with nStore
