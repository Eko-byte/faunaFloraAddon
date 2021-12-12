const fs = require('fs')

function getFiles (dir, files){
    var files = files || [];
    var file = fs.readdirSync(dir);
    files.push(file)
    return files;
}

fs.writeFileSync("data.json", JSON.stringify(getFiles('c:/Users/ekans/Documents/bridge/projects/faunaFloraAddon/BP/blocks')))