import Image from "next/image";
import { diameterText } from "../lib/celestial-data.js";

function compactDiameter(body) {
  const value = body.diameter >= 1e6
    ? `${body.diameter.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2 })} km`
    : diameterText(body.diameter);
  return `${body.uncertain ? "≈ " : ""}${value}`;
}

function statusLabel(body) {
  if (body.caveatSource) return "Disputed";
  if (body.kind.toLowerCase().includes("candidate")) return "Candidate";
  return null;
}

function BodyThumbnail({ body }) {
  if (body.type === "black-hole")
    return <span className="thumb black-hole-thumb" style={{ "--horizon-color": body.color }} aria-hidden="true" />;
  return (
    <Image
      className="thumb"
      src={`/textures/${body.texture}`}
      width={38}
      height={38}
      unoptimized
      alt=""
      style={body.illustrative ? {
        filter: body.id.startsWith("sirius")
          ? "grayscale(1) sepia(.15) hue-rotate(165deg)"
          : "sepia(.5) saturate(1.5)",
      } : undefined}
    />
  );
}

export function CatalogBody({ body, selected, onToggle }) {
  const status = statusLabel(body);
  return (
    <button
      className={`catalog-item${selected ? " selected" : ""}`}
      aria-pressed={selected}
      aria-label={`${selected ? "Remove" : "Add"} ${body.name}${status ? ` (${status.toLowerCase()})` : ""}`}
      title={`${body.kind} · ${body.diameterKind || "Diameter"}: ${diameterText(body.diameter)}${body.highlight ? ` · ${body.highlight}` : ""}`}
      onClick={() => onToggle(body.id)}
    >
      <BodyThumbnail body={body} />
      <span className="catalog-body">
        <span className="catalog-name">{body.name}</span>
        <span className="catalog-meta">
          {compactDiameter(body)}{body.type === "black-hole" ? " horizon" : ""}
        </span>
        {status && <span className="body-status">{status}</span>}
      </span>
      <span className="catalog-add" aria-hidden="true">{selected ? "✓" : "+"}</span>
    </button>
  );
}

export function BodyCard({ body, focused, onFocus, onRemove }) {
  const status = statusLabel(body);
  return (
    <div className={`body-card${focused ? " focused" : ""}`}>
      <button
        className="card-select"
        onClick={() => onFocus(body.id)}
        aria-label={`Focus ${body.name}`}
        aria-pressed={focused}
        title={`Focus ${body.name} · ${body.diameterKind || "Diameter"}: ${diameterText(body.diameter)}`}
      >
        <BodyThumbnail body={body} />
        <div className="card-main">
          <div className="card-name">{body.name}</div>
          <div className="card-size">
            {compactDiameter(body)}{body.type === "black-hole" ? " horizon" : ""}
          </div>
          {status && <span className="body-status">{status}</span>}
        </div>
      </button>
      <button className="card-remove" onClick={() => onRemove(body.id)} aria-label={`Remove ${body.name}`} title={`Remove ${body.name}`}>×</button>
    </div>
  );
}

export function ComparisonInsight({ bodies, focusedId, mode, onDetails }) {
  if (!bodies.length) return null;
  const sorted = [...bodies].sort((a, b) => a.diameter - b.diameter);
  const small = sorted[0], large = sorted.at(-1);
  const detailBody = bodies.find((body) => body.id === focusedId) || (bodies.length === 1 ? bodies[0] : null);
  const ratio = large.diameter / small.diameter;
  return (
    <>
      <span className="insight-summary">
        {detailBody ? (
          <><strong>{detailBody.name}</strong>{focusedId ? " · focused" : ""}</>
        ) : (
          <><strong>{large.name}</strong> is <strong>{bodies.some(body => body.uncertain) ? "≈ " : ""}{ratio.toLocaleString("en-US", { maximumFractionDigits: 1, ...(ratio >= 1e6 ? { notation: "compact" } : {}) })}×</strong> wider than {small.name}.</>
        )}
        {!detailBody && mode === "true" && ratio > 1000 && (
          <span className="tiny-body-hint">Select a card to inspect tiny bodies.</span>
        )}
      </span>
      <button className="details-button" onClick={() => onDetails(detailBody?.id || large.id)} aria-label={`View details for ${detailBody?.name || large.name}`}>Details ↗</button>
    </>
  );
}
