import { generate } from 'youtube-po-token-generator';
async function test() {
  try {
    const token = await generate();
    console.log(token);
  } catch (e) {
    console.error(e.message);
  }
}
test();
