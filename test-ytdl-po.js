import youtubedl from 'youtube-dl-exec';
import { generate } from 'youtube-po-token-generator';

async function test() {
  try {
    const { visitorData, poToken } = await generate();
    console.log("Generated token:", poToken);
    
    const output = await youtubedl('https://www.youtube.com/watch?v=dfyiDnttORk', {
      dumpJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      extractorArgs: `youtube:po_token=web+${poToken}`
    });
    console.log(output.title);
  } catch (e) {
    console.error(e.message);
  }
}
test();
