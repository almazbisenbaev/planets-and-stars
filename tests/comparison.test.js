import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { BODIES, byId, radiusFor, speeds, horizonDiameterKm, diameterText, spinTiltDegrees, matchesBodyFilter } from "../lib/celestial-data.js";
import { createHash } from "node:crypto";
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
        radiusFor(first, pair) / radiusFor(second, pair);
      assert.ok(
        Math.abs(actual / (first.diameter / second.diameter) - 1) < 1e-12,
        `${first.id} / ${second.id}`,
      );
    }
});

test("retrograde periods match inverted spin axes; unknown stellar spins stay unmodeled", () => {
  for (const body of BODIES.filter((body) => body.period !== null))
    for (const showTilt of [true, false])
      assert.equal(
        Math.cos((spinTiltDegrees(body, showTilt) * Math.PI) / 180) < 0,
        body.period < 0,
        `${body.id}, tilt ${showTilt}`,
      );
  assert.equal(byId.sirius.period, null);
  assert.equal(byId.betelgeuse.period, null);
  assert.equal(speeds[0], 1);
  assert.equal(speeds[3], 3600);
});

test("comparison configuration validates before changing state and copies caller-owned arrays", () => {
  const input = { bodyIds: ["earth", "moon"] };
  const patch = validateComparison(input);
  input.bodyIds.push("sun");
  assert.deepEqual(patch, { selected: ["earth", "moon"] });
  const snapshot = readComparison({
    ...INITIAL_STATE,
    ...patch,
    playing: true,
  });
  assert.deepEqual(
    snapshot.bodies.map((body) => body.id),
    ["earth", "moon"],
  );
  assert.equal(snapshot.sizeMode, "true");
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
    { bodyIds: ["earth"], sizeMode: "equal" },
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
  const manifest = JSON.parse(await readFile(new URL("../public/textures/catalog-attribution.json", import.meta.url), "utf8"));
  for (const asset of manifest.assets) {
    const bytes = await readFile(new URL(`../public/textures/${asset.file}`, import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256, asset.file);
    assert.equal(asset.size[0], asset.size[1] * 2, `${asset.file} projection`);
    assert.ok(asset.credit && asset.source_page);
  }
});

test("expanded catalog has valid dimensions, discoverable types and no invented exoplanet spins", () => {
  assert.equal(new Set(BODIES.map(body => body.id)).size, BODIES.length);
  for (const body of BODIES) {
    assert.ok(Number.isFinite(body.diameter) && body.diameter > 0, body.id);
    assert.ok(body.texture || body.type === "black-hole" || body.appearance, body.id);
  }
  assert.ok(matchesBodyFilter(byId.pluto, "planet"));
  assert.ok(matchesBodyFilter(byId["trappist-1-e"], "exoplanet"));
  assert.equal(matchesBodyFilter(byId["trappist-1-e"], "star"), false);
  assert.ok(byId.ganymede.diameter > byId.mercury.diameter);
  assert.ok(byId.titan.diameter > byId.mercury.diameter);
  assert.ok(byId.mimas.diameter < byId.enceladus.diameter);
  for (const body of BODIES.filter(body => body.type === "exoplanet")) {
    assert.equal(body.diameter, body.earthRadii * 12756.2);
    assert.equal(body.period, null);
    assert.equal(body.tilt, null);
    assert.equal(body.illustrative, true);
  }
  assert.equal(byId.triton.tilt, null);
  assert.equal(spinTiltDegrees(byId.triton, true), 180);
  assert.ok(Math.abs(byId["cygnus-x-1"].diameter - 125.2188) < 0.001);
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
