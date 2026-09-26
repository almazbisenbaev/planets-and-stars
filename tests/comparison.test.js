import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { BODIES, byId, radiusFor, speeds, horizonDiameterKm, diameterText } from "../lib/celestial-data.js";
import {
  INITIAL_STATE,
  readComparison,
  validateComparison,
} from "../lib/comparison.js";

test("true scale preserves every physical diameter ratio, including extreme stellar sizes", () => {
  for (const first of BODIES)
    for (const second of BODIES) {
      const pair = [first, second];
      const actual =
        radiusFor(first, pair, "true") / radiusFor(second, pair, "true");
      assert.ok(
        Math.abs(actual / (first.diameter / second.diameter) - 1) < 1e-12,
        `${first.id} / ${second.id}`,
      );
      assert.equal(
        radiusFor(first, pair, "equal"),
        radiusFor(second, pair, "equal"),
      );
    }
});

test("retrograde periods match inverted spin axes; unknown stellar spins stay unmodeled", () => {
  for (const body of BODIES.filter((body) => body.period !== null)) {
    assert.equal(
      Math.cos((body.tilt * Math.PI) / 180) < 0,
      body.period < 0,
      body.id,
    );
  }
  assert.equal(byId.sirius.period, null);
  assert.equal(byId.betelgeuse.period, null);
  assert.equal(speeds[0], 1);
  assert.equal(speeds[3], 3600);
});

test("comparison configuration validates before changing state and copies caller-owned arrays", () => {
  const input = { bodyIds: ["earth", "moon"], sizeMode: "equal" };
  const patch = validateComparison(input);
  input.bodyIds.push("sun");
  assert.deepEqual(patch, { selected: ["earth", "moon"], mode: "equal" });
  const snapshot = readComparison({
    ...INITIAL_STATE,
    ...patch,
    playing: true,
  });
  assert.deepEqual(
    snapshot.bodies.map((body) => body.id),
    ["earth", "moon"],
  );
  assert.equal(snapshot.sizeMode, "equal");
  assert.equal(snapshot.simulatedSecondsPerSecond, 3600);
});

test("invalid and oversized comparisons are rejected without corrupting the initial state", () => {
  const before = JSON.stringify(INITIAL_STATE);
  for (const invalid of [
    null,
    {},
    { bodyIds: [] },
    { bodyIds: ["earth", "earth"] },
    { bodyIds: ["unknown"] },
    { bodyIds: ["__proto__"] },
    { bodyIds: BODIES.slice(0, 7).map((body) => body.id) },
    { bodyIds: ["earth"], sizeMode: "huge" },
    { bodyIds: ["earth"], extra: true },
  ]) {
    assert.throws(() => validateComparison(invalid));
  }
  assert.equal(JSON.stringify(INITIAL_STATE), before);
});

test("every surface map and attribution is available under Next public assets", async () => {
  const files = [
    ...new Set(BODIES.map((body) => body.texture).filter(Boolean)),
    "2k_earth_clouds.jpg",
    "2k_saturn_ring_alpha.png",
    "ATTRIBUTION.md",
    "attribution.json",
  ];
  await Promise.all(
    files.map((file) =>
      access(new URL(`../public/textures/${file}`, import.meta.url)),
    ),
  );
  const attribution = await readFile(
    new URL("../public/textures/ATTRIBUTION.md", import.meta.url),
    "utf8",
  );
  assert.match(attribution, /creativecommons\.org\/licenses\/by\/4\.0/);
});

test("black hole diameters use the nonrotating horizon, not the radius or shadow", () => {
  assert.ok(Math.abs(horizonDiameterKm(1) - 5.9065) < 0.0001);
  assert.ok(Math.abs(byId.gw190814.diameter - 15.357) < 0.001);
  assert.ok(Math.abs(byId["ton-618"].diameter / 1e9 - 389.832) < 0.01);
  for (const body of BODIES.filter((body) => body.type === "black-hole")) {
    assert.equal(body.period, null);
    assert.equal(body.tilt, null);
    assert.equal(body.diameterKind, "Schwarzschild horizon");
    assert.ok(body.source.url.startsWith("https://"));
  }
  assert.match(byId.gw190814.note, /neutron star/);
  assert.match(byId["stephenson-2-18"].note, /not a confirmed largest star/);
  assert.notEqual(diameterText(0.0002), "0 km");
});
