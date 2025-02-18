const fs = require('fs');
const path = require('path');

function get_nasheeds(e)
{
    let audios = path.join(__dirname, `${e}.mp3`);
    return fs.existsSync(audios) ? audios : null;
}
module.exports = { get_nasheeds };