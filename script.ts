import { setTimeout } from "timers/promises";
const API_URL = "YOUR_API_URL";
import fetch from "node-fetch";
import { URL } from "url";

async function makeCall() {
  const chance = Math.random() < 0.2;
  const u = new URL(API_URL);
  if (chance) {
    u.searchParams.append("fail", "true");
  }

  const response = await fetch(u.toString());
  const data = await response.text();

  console.log({ data });
}

const wait = async (ms: number) => {
  await setTimeout(ms);
};
async function main() {
  while (true) {
    console.log("Making the request");
    try {
      await makeCall();
    } catch (e) {
      console.log("error", e);
    } finally {
      await wait(2_000);
    }
  }
}

main();
