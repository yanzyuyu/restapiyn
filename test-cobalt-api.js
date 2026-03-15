async function test() {
  const instances = [
    "https://api.qwkuns.me",
    "https://api.kektube.com",
    "https://cobaltapi.cjs.nz",
    "https://api.dl.woof.monster",
    "https://cobaltapi.squair.xyz",
    "https://api.cobalt.blackcat.sweeux.org",
    "https://cobalt.alpha.wolfy.love",
    "https://cobalt.omega.wolfy.love",
    "https://subito-c.meowing.de",
    "https://nuko-c.meowing.de",
    "https://melon.clxxped.lol",
    "https://grapefruit.clxxped.lol",
    "https://pizza.br0k3.me",
    "https://cookie.br0k3.me"
  ];
  
  for (const url of instances) {
    try {
      const res = await fetch(`${url}/api/json`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: "https://www.youtube.com/watch?v=dfyiDnttORk" })
      });
      const data = await res.json();
      if (data.status === 'stream' || data.status === 'redirect' || data.status === 'picker') {
        console.log(`SUCCESS: ${url}`);
        console.log(data);
        break;
      } else {
        console.log(`FAILED: ${url} - ${data.text || data.error?.message || data.title}`);
      }
    } catch (e) {
      console.log(`ERROR: ${url} - ${e.message}`);
    }
  }
}
test();
