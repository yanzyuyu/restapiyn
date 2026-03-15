import youtubedl from 'youtube-dl-exec';
async function test() {
  try {
    const output = await youtubedl('https://www.youtube.com/watch?v=dfyiDnttORk', {
      dumpJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      proxy: 'http://103.152.112.162:80' // random public proxy
    });
    console.log(output.title);
  } catch (e) {
    console.error(e.message);
  }
}
test();
