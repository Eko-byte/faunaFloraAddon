const fs = require('fs')

function getFiles (dir){
    var file = fs.readdirSync(dir);
    return file;
}

fs.writeFileSync("data.json", JSON.stringify(getFiles('c:/Users/ekans/Documents/bridge/projects/faunaFloraAddon/BP/items')))