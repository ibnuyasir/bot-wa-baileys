const { yt_scrp } = require('./commands/s');
const { get_nasheeds } = require('./commands/media/nasheeds')

function msg_system(text, callback, b, en)
{
    let response = text.toLowerCase();

    if (response.startsWith('._menu'))
    {
        let a = 
`
*Bot Wa Node Je'es*
By: Kurt
=====================

> Fitur
- .yt_search
- .nasheed

=====================
`;
        callback(a, b);
        return;
    }
    if (response.startsWith('.yt_search')) 
    {
        let query = text.replace('.yt_search', '').trim();
        if (!query)
        {
            callback('Masukkan url! contoh: .yt_search qalu lahu');
            return;
        }
        yt_scrp(query)
            .then(result =>
            {
                let ress = `
*Query Search Res: 25*
*Search: ${query}*
\n\n${result}
`;
                callback(ress, b);
            })
            .catch(err =>
            {
                callback(`${err.stack}`);
            });
        return;
    }
    if (response.startsWith('.nasheed'))
    {
        let str_1 = response.split(' ');
        if (str_1.length < 2)
        {
            callback('Masukkan nama nasheed, contoh .nasheed main', b);
            return;
        }
        let nasheed_nama = str_1[1];
        let nasheed_dir = get_nasheeds(nasheed_nama);
        if (nasheed_dir)
        {
            callback(nasheed_dir, b);
        }
        else
        {
            callback('Nasheed tidak ditemukan: 404', b);
        }
    }
}
module.exports = { msg_system };