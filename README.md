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

# author(s)

* **Primary:** Joshua Holbrook (jesusabdullah)
* James Halliday (substack)

# licensing

                DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                        Version 2, December 2004

     Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>

     Everyone is permitted to copy and distribute verbatim or modified
     copies of this license document, and changing it is allowed as long
     as the name is changed.

                DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
       TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

      0. You just DO WHAT THE FUCK YOU WANT TO.
