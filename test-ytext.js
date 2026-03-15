import { extractStreamInfo, prepareStreamInfo } from 'youtube-ext';
async function test() {
  try {
    const info = await extractStreamInfo('https://www.youtube.com/watch?v=dfyiDnttORk');
    console.log(Object.keys(info));
    const prepared = await prepareStreamInfo(info);
    console.log(Object.keys(prepared));
    console.log(prepared.formats.slice(0, 1));
  } catch (e) {
    console.error(e.message);
  }
}
test();
