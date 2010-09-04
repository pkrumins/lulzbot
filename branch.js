var spawn = require('child_process').spawn;

module.exports = function (cb) {
    //Used with branch.sh to get the current git branch
    //from within node.js.
    //May eventually port branch.sh to node.
    var getBranch = spawn("./branch.sh");

    getBranch.stdout.on('data', function (data) {
        var branch = data.toString("utf-8")
                         .slice(0,branch.length-1);
        cb(branch);
    });

    getBranch.stderr.on('data', function (data) {
                console.log("There was a source-getting error: "+data.toString("utf-8"));
    });
}
