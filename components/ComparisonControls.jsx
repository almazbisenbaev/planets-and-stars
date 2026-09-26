import Image from "next/image";
import { byId, diameterText, bodyDetails } from "../lib/celestial-data.js";

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
      style={
        body.illustrative
          ? {
              filter:
                body.id.startsWith("sirius")
                  ? "grayscale(1) sepia(.15) hue-rotate(165deg)"
                  : "sepia(.5) saturate(1.5)",
            }
          : undefined
      }
    />
  );
}

export function CatalogBody({ body, selected, onToggle }) {
  return (
    <button
      className={`catalog-item${selected ? " selected" : ""}`}
      aria-pressed={selected}
      aria-label={`${selected ? "Remove" : "Add"} ${body.name}`}
      onClick={() => onToggle(body.id)}
    >
      <BodyThumbnail body={body} />
      <span className="catalog-body">
        <span className="catalog-name">{body.name}</span>
        <span className="catalog-meta">
          {body.uncertain ? "≈ " : ""}{diameterText(body.diameter)}
          {body.type === "black-hole" ? " · horizon" : ""}
        </span>
        {body.highlight && <span className="catalog-highlight">{body.highlight}</span>}
      </span>
      <span className="catalog-add" aria-hidden="true">
        {selected ? "✓" : "+"}
      </span>
    </button>
  );
}

export function BodyCard({ body, onFocus, onRemove }) {
  return (
    <div className="body-card">
      <button
        className="card-select"
        onClick={() => onFocus(body.id)}
        aria-label={`Focus ${body.name}. ${body.diameterKind || "Diameter"}: ${diameterText(body.diameter)}. ${bodyDetails(body)}`}
        title={`${body.name} · ${bodyDetails(body)}${body.highlight ? ` · ${body.highlight}` : ""}`}
      >
        <BodyThumbnail body={body} />
        <div className="card-main">
          <div className="card-name">{body.name}</div>
          <div className="card-type">{body.kind.toUpperCase()}</div>
        </div>
        <div className="card-data">
          <div className="card-diameter">{body.uncertain ? "≈ " : ""}{diameterText(body.diameter)}</div>
          <div className="card-ratio">
            {(body.diameter / byId.earth.diameter).toLocaleString("en-US", {
              maximumFractionDigits: 2,
              ...(body.diameter < 100 ? { maximumSignificantDigits: 3 } : {}),
              ...(body.diameter / byId.earth.diameter > 1e6 ? { notation: "compact" } : {}),
            })}{" "}
            × Earth
          </div>
        </div>
      </button>
      <button
        className="card-remove"
        onClick={() => onRemove(body.id)}
        aria-label={`Remove ${body.name}`}
      >
        ×
      </button>
    </div>
  );
}

export function ComparisonInsight({ bodies, mode, focusedId }) {
  if (!bodies.length) return <>Compare up to six planets, moons, stars and black holes.</>;
  let content;
  const detailBody = bodies.find((body) => body.id === focusedId) || (bodies.length === 1 ? bodies[0] : null);
  if (detailBody) {
    const body = detailBody;
    content = (
      <>
        <strong>{body.name}</strong> · {bodyDetails(body)}.
        {focusedId ? " Press F to fit all." : ""}
        {body.note && (
          <span className="object-note">
            {body.note}{" "}
            <a href={body.source.url} target="_blank" rel="noreferrer">Source ↗</a>
            {body.caveatSource && <> · <a href={body.caveatSource.url} target="_blank" rel="noreferrer">Uncertainty ↗</a></>}
          </span>
        )}
        {!body.note && body.illustrative ? " Illustrative surface; spin not modeled." : ""}
        {body.type === "black-hole" && <span className="object-note">Nonrotating horizon model. The faint rim is a visibility guide; lensing and accretion are not simulated.</span>}
        {mode === "equal" ? " Equal size mode does not preserve size ratios." : ""}
      </>
    );
  } else {
    const sorted = [...bodies].sort((a, b) => a.diameter - b.diameter),
      small = sorted[0],
      large = sorted.at(-1);
    content = (
      <>
        <strong>{large.name}</strong> is{" "}
        <strong>
          {(large.diameter / small.diameter).toLocaleString("en-US", {
            maximumFractionDigits: 1,
          })}
          × wider
        </strong>{" "}
        than {small.name}.
        {mode === "equal"
          ? " Equal size mode does not preserve size ratios."
          : bodies.some((body) => body.uncertain)
            ? " Based on adopted estimates; select a card for sources and uncertainty."
            : " A whole new sense of scale."}
        {bodies.some((body) => body.type === "black-hole")
          ? " Black hole sizes are reference horizon diameters."
          : ""}
        {mode === "true" && large.diameter / small.diameter > 1000
          ? " Tiny bodies may be below one pixel. Click their cards to focus."
          : ""}
      </>
    );
  }
  return (
    <>
      <span className="info-icon" aria-hidden="true">
        i
      </span>
      <span>{content}</span>
    </>
  );
}
