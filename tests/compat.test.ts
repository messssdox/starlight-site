import { test } from "node:test";
import assert from "node:assert/strict";
import { compare, elementRelation, comparisonBreakdown, yearTheme } from "../src/lib/compat.ts";
import { RELATIONSHIPS, KINDS, relationshipById } from "../src/data/relationships.ts";

test("element relations follow the feeding and checking cycles", () => {
  assert.equal(elementRelation("Water", "Wood"), "iFeed");
  assert.equal(elementRelation("Wood", "Water"), "theyFeed");
  assert.equal(elementRelation("Metal", "Wood"), "iGuide");
  assert.equal(elementRelation("Wood", "Metal"), "theyGuide");
  assert.equal(elementRelation("Fire", "Fire"), "same");
});

test("harmony scores secret friends with feeding elements highly", () => {
  // 1984-06-01 Wood Rat; 1985-06-01 Wood Ox: secret friends, same element
  const c = compare("1984-06-01", "1985-06-01", 2026);
  assert.equal(c.relation, "secret");
  assert.equal(c.element, "same");
  assert.ok(c.harmony >= 3.5 && c.harmony <= 5);
  const b = comparisonBreakdown(c, "Sam");
  assert.equal(b.result, `Your harmony is ${c.harmony} out of 5.`);
});

test("every relationship has a kind with full wording", () => {
  for (const [id, r] of Object.entries(RELATIONSHIPS)) {
    const k = KINDS[r.kind];
    assert.ok(k, id);
    assert.equal(Object.keys(k.chinese).length, 5, id);
    assert.equal(k.tips.length, 3, id);
  }
  assert.equal(relationshipById("sibling")?.kind, "sibling");
  assert.equal(relationshipById("aunt")?.label, "Aunt");
  assert.equal(relationshipById("nobody"), undefined);
});

test("Personal Year themes read as short phrases", () => {
  assert.equal(yearTheme(1), "fresh starts");
  assert.equal(yearTheme(9), "completion");
});
