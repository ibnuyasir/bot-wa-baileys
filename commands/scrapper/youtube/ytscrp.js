const yts = require('yt-search');

async function get_video(query)
{
    let r = await yts(query);
    let videos = r.videos.slice(0, 25);
    videos.forEach( function ( v )
    {
        let views = String( v.views ).padStart( 10, ' ' )
    })
    return videos.map(video => `
> *${video.title}*
- Channel: ${video.author.name}
- Duration: ${video.duration}
- Link: ${video.url}
`).join('');
}
module.exports = { get_video };