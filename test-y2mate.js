async function test() {
  try {
    const res = await fetch("https://www.y2mate.com/mates/en68/analyze/ajax", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "url=https://www.youtube.com/watch?v=dfyiDnttORk&q_auto=1&ajax=1"
    });
    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.error(e.message);
  }
}
test();
