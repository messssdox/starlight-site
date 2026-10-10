import { test } from "node:test";
import assert from "node:assert/strict";
import { chineseSign, friendsOf, secretFriendOf, clashOf, relationBetween } from "../src/lib/chinese.ts";

test("animal changes at Lunar New Year, not 1 January", () => {
  assert.equal(chineseSign("1990-01-20").animal.id, "snake");
  assert.equal(chineseSign("1990-01-27").animal.id, "horse");
  assert.equal(chineseSign("2026-02-16").animal.id, "snake");
  assert.equal(chineseSign("2026-02-17").animal.id, "horse");
});

test("year element and yin/yang", () => {
  const s = chineseSign("1984-06-01");
  assert.equal(s.animal.id, "rat");
  assert.equal(s.element, "Wood");
  assert.equal(s.yinYang, "Yang");
  assert.equal(chineseSign("2026-06-01").element, "Fire");
});

test("wheel relationships", () => {
  assert.deepEqual(friendsOf("rat").map((a) => a.id), ["dragon", "monkey"]);
  assert.equal(secretFriendOf("tiger").id, "pig");
  assert.equal(secretFriendOf("goat").id, "horse");
  assert.equal(clashOf("rat").id, "horse");
  assert.equal(clashOf("snake").id, "pig");
  assert.equal(relationBetween("dragon", "dog"), "clash");
  assert.equal(relationBetween("dragon", "rooster"), "secret");
  assert.equal(relationBetween("dragon", "ox"), "neutral");
});
