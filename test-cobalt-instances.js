async function test() {
  try {
    const res = await fetch("https://raw.githubusercontent.com/imputnet/cobalt/current/instances.json");
    const data = await res.text();
    console.log(data);
  } catch (e) {
    console.error(e.message);
  }
}
test();
