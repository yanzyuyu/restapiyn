import youtubedl from 'youtube-dl-exec';
async function test() {
  try {
    const output = await youtubedl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
      dumpJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: [
        'referer:youtube.com',
        'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      ]
    });
    
    const videoFormats = output.formats.filter(f => f.vcodec !== 'none');
    const audioFormats = output.formats.filter(f => f.vcodec === 'none' && f.acodec !== 'none');
    
    console.log("Video:", videoFormats.map(f => ({ res: f.resolution, ext: f.ext, acodec: f.acodec })));
    console.log("Audio:", audioFormats.map(f => ({ abr: f.abr, ext: f.ext })));
  } catch (e) {
    console.error(e);
  }
}
test();
