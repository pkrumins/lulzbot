# lulzbot
Lulzbot is an IRC bot that runs on node.js. So far, lulzbot only watches github repos and spews information when new commits show up on a branch.

# dependencies

* [node.js](http://nodejs.org) (of course)
* [IRC-js](http://www.github.com/gf3/IRC-js)
* [node-github](http://www.github.com/ajaxorg/node-github)

I considered using Jerk as well, but my needs extended past merely being able to parse and respond to irc events. As features are added, so may there be more deps.

# todo

* Install libraries so that absolute paths are unnecessary
* Add a configuration file
* Add some reload action (possibly via the REPL)
* Wrap bot up into a separate-able library?
* Figure out why bot eventually "times out" when left alone and fix.
* Allow more nuanced control of github watchings
* Spruce up lulzbot's output, make more amusing
* Cut off commit listings at some arbitrary number to avoid floods
