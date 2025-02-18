const { get_video } = require('./scrapper/youtube/ytscrp');

async function yt_scrp(query)
{
    try
    {
        return await get_video(query);
    }
    catch (error)
    {
        return `${error.message}`;
    }
}
module.exports = { yt_scrp };