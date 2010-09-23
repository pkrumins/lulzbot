# lulzbot
Lulzbot is an IRC bot that runs on node.js, and lives in #stackvm. It's in a state of flux and non-workingness right now, and while I would eventually like it to be npm installable such is not the case right now. Before that happens...

# TODO:
(Feel free to do these for me!)
* **Fix databasery in gitwatch.js.** Substack used nStore, but corruption issues have me trying to port it to Supermarket. It almost works now.
* **Add databasery to twitter.js.** Twitter.js now only watches for things hard-coded into it. Adding !watch-like commands is desirable.
* **Figure out where the Hell the twitter import spam is coming from.** My suspicions are that it is in evented-twitter itself.
* **Figure out wth is going on with weather.js.** For some reason, lulzbot does not return the entire weather message. This used to work.
* **Make lulzbot easier to start.** Ideally it would be one command, not two. There is a program that *should* run and manage both "sides" of lulzbot, but it's pretty buggy. I may remove the dnode dependency someday, which was introduced to allow hotloading and better bot uptimes.

# Prereqs: 
git, node.js. Has an npm file, but that's pretty jacked up atm. I'll fix it as lulzbot becomes more stable.

# installation & running

    git clone http://github.com/jesusabdullah/lulzbot.git
    cd lulzbot/bin
    ./relay.js --server=<whatever> --nick=<whatever> --channel=<whatever> &
    ./services.js --user=<whatever> --pass=<whatever>

The username and password part are for twitter services. Feel free to remove that module and delete those arguments! I just haven't done anything with it is all.



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
