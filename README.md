# lulzbot
Lulzbot is an IRC bot that runs on node.js, and lives in #stackvm.

# installation

    git clone http://github.com/jesusabdullah/lulzbot.git
    cd lulzbot
    npm install

Prereqs: git, node.js, npm

# commands

* **!weather** (or !wx) *search* : what's the weather?
* **!source**: lists lulzbot's source's url for the active branch
* **!onscreen**: prints out some kinda Klingon spaceship
* **!lns**: Shortens urls using ln-s.net
* **!watch** *user*/*repo* (*branch*): Watch this github repo. The *branch* argument is optional, and defaults to master.
* **!unwatch** *user*/*repo* (*branch*): Un-watch a github repo.

# services

* **gitwatch** watches github repos in github.db

# future

* **twitterwatch** to watch twitter for mentions of stackvm
