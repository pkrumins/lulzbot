# lulzbot
Lulzbot is an IRC bot that runs on node.js, and lives in #stackvm. It's in a state of flux and non-workingness right now, and while I would eventually like it to be npm installable such is not the case right now. Before that happens...

# TODO:
(Feel free to do these for me!)

* **Add databasery to twitter.js.** Twitter.js now only watches for things hard-coded into it. Adding !watch-like commands is desirable.  
* **Figure out where the Hell the twitter import spam is coming from.** My suspicions are that it is in evented-twitter itself.  
* **Make lulzbot easier to start.** Ideally it would be one command, not two. There is a program that *should* run and manage both "sides" of lulzbot, but it's pretty buggy. I may remove the dnode dependency someday, which was introduced to allow hotloading and better bot uptimes.

# Prereqs: 
git, node.js. Has an npm file, but that's pretty jacked up atm. I'll fix it as lulzbot becomes more stable.

# installation & running

    git clone http://github.com/jesusabdullah/lulzbot.git
    cd lulzbot/bin
    ./relay.js --server=<whatever> --nick=<whatever> --channel=<whatever> &
    ./services.js

# commands

* **!weather** (or !wx) *search* : what's the weather?
* **!source**: lists lulzbot's source's url for the active branch
* **!onscreen**: prints out some kinda Klingon spaceship
* **!lns**: Shortens urls using ln-s.net
* **!furryurl**: Shortens urls using furryurl.com
* **!watch** *user*/*repo* (*branch*): Watch this github repo. The *branch* argument is optional, and defaults to master.  
* **!unwatch** *user*/*repo* (*branch*): Un-watch a github repo.
* **!gitlist**: Lists watched github repos.
* **!justme**: Says if the website at a given url is down.
* **!join**: Make lulzbot join a channel! (Does not store in a db)
* **!part**: Make lulzbot part a channel! (Can not part channels specified with options flag)

# services

* **gitwatch** Watches github repos in github.db

# In The Works:

* **twitterwatch** Watches twitter for mentions of stackvm (Currently has broken lib)
* **!ddg** Duck Duck Go sexiness

# author(s)

* **Primary:** Joshua Holbrook (jesusabdullah)
* James Halliday (substack)
* Peteris Krumins (pkrumins)

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
