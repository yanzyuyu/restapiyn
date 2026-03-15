import { Innertube } from 'youtubei.js';

async function test() {
  try {
    const yt = await Innertube.create();
    const info = await yt.getBasicInfo('dfyiDnttORk');
    console.log(info.basic_info.title);
    console.log(info.streaming_data.formats.length);
  } catch (e) {
    console.error(e.message);
  }
}
test();
