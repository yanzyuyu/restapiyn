async function test() {
  try {
    const res = await fetch("https://yt1s.com/api/ajaxSearch/index", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "q=https://www.youtube.com/watch?v=dfyiDnttORk&vt=home"
    });
    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.error(e.message);
  }
}
test();
