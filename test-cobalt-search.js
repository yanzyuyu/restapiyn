async function test() {
  try {
    const res = await fetch("https://api.github.com/repos/hyperdefined/cobalt.directory/contents");
    const data = await res.json();
    console.log(data.map(i => i.name));
  } catch (e) {
    console.error(e.message);
  }
}
test();
