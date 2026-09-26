import { BODIES, byId, speeds } from "./celestial-data.js";

export const INITIAL_STATE = {
  selected: ["earth", "jupiter", "saturn"],
  playing: false,
  speed: 3,
  tilt: true,
  labels: false,
  axes: false,
  lighting: "studio",
};

export function validateComparison(input) {
  if (
    !input ||
    !Array.isArray(input.bodyIds) ||
    input.bodyIds.length < 1 ||
    input.bodyIds.length > 6 ||
    input.bodyIds.some(
      (id) => typeof id !== "string" || !Object.hasOwn(byId, id),
    ) ||
    new Set(input.bodyIds).size !== input.bodyIds.length ||
    Object.keys(input).some((key) => key !== "bodyIds")
  )
    throw new Error(
      "Choose one to six unique body IDs from the celestial library.",
    );
  return {
    selected: [...input.bodyIds],
  };
}

export function readComparison(state) {
  return {
    bodies: state.selected.map((id) => ({
      id,
      name: byId[id].name,
      diameterKm: byId[id].diameter,
      rotationHours: byId[id].period,
      axialTiltDegrees: byId[id].tilt,
      illustrativeSurface: !!byId[id].illustrative,
      diameterKind: byId[id].diameterKind || "Body diameter",
      ...(byId[id].solarMasses ? { solarMasses: byId[id].solarMasses } : {}),
      ...(byId[id].note ? { note: byId[id].note, source: byId[id].source } : {}),
    })),
    sizeMode: "true",
    playing: state.playing,
    simulatedSecondsPerSecond: speeds[state.speed],
  };
}

export const comparisonSchema = {
  type: "object",
  properties: {
    bodyIds: {
      type: "array",
      items: { type: "string", enum: BODIES.map((body) => body.id) },
      minItems: 1,
      maxItems: 6,
      uniqueItems: true,
    },
  },
  required: ["bodyIds"],
  additionalProperties: false,
};
