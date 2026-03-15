import youtubedl from 'youtube-dl-exec';
async function test() {
  try {
    const output = await youtubedl('https://www.youtube.com/watch?v=dfyiDnttORk', {
      dumpJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      extractorArgs: 'youtube:player_client=tv'
    });
    console.log(output.title);
  } catch (e) {
    console.error(e.message);
  }
}
test();
