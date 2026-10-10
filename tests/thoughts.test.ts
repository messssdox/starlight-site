import { test } from "node:test";
import assert from "node:assert/strict";
import { looksLikeABot, validateSubmission, publicName, MIN_FILL_MS } from "../server/thoughts.ts";

const good = { kind: "praise", email: "Ada@Example.com ", firstName: " Ada  Lovelace ", starSign: "Leo", message: "Lovely site!", showPublicly: "on" };

test("a normal praise message is accepted and tidied", () => {
  const r = validateSubmission(good);
  assert.ok(r.ok);
  assert.deepEqual(r.value, { kind: "praise", email: "ada@example.com", firstName: "Ada Lovelace", starSign: "Leo", message: "Lovely site!", showPublicly: true });
});

test("only praise can be shown publicly", () => {
  const r = validateSubmission({ ...good, kind: "feedback" });
  assert.ok(r.ok);
  assert.equal(r.value.showPublicly, false);
});

test("praise stays private unless the box is ticked", () => {
  const r = validateSubmission({ ...good, showPublicly: undefined });
  assert.ok(r.ok && r.value.showPublicly === false);
});

test("bad input is rejected with a friendly reason", () => {
  for (const bad of [
    { ...good, kind: "spam" },
    { ...good, email: "not-an-email" },
    { ...good, email: "" },
    { ...good, message: "" },
    { ...good, message: "x".repeat(2001) },
    { ...good, starSign: "Ophiuchus" },
    { ...good, firstName: "x".repeat(41) },
    { ...good, message: "http://a http://b http://c www.d" },
  ]) {
    const r = validateSubmission(bad);
    assert.equal(r.ok, false, JSON.stringify(bad));
    assert.ok(!r.ok && r.error.length > 0);
  }
});

test("non-text values don't crash validation", () => {
  assert.equal(validateSubmission({ kind: 5, email: {}, message: [] }).ok, false);
});

test("bots are spotted by the honeypot and by speed", () => {
  const now = 1_000_000;
  assert.equal(looksLikeABot({ website: "http://spam" }, now), true);
  assert.equal(looksLikeABot({ t: String(now - 500) }, now), true);
  assert.equal(looksLikeABot({ t: String(now - MIN_FILL_MS - 1) }, now), false);
  assert.equal(looksLikeABot({ t: "" }, now), false); // JavaScript off: no timestamp, not a bot
  assert.equal(looksLikeABot({}, now), false);
});

test("the wall shows a first name only", () => {
  assert.equal(publicName("Ada Lovelace"), "Ada");
  assert.equal(publicName("  "), "A kind visitor");
});
