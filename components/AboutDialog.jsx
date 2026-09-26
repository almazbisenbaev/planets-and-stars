import { BODIES, byId, diameterText, periodText } from "../lib/celestial-data.js";

export default function AboutDialog({ dialogRef, body }) {
  function handleBackdrop(event) {
    if (event.target !== dialogRef.current) return;
    const bounds = event.target.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialogRef.current.close();
  }
  return (
    <dialog id="about-dialog" ref={dialogRef} onClick={handleBackdrop} aria-labelledby="data-panel-title">
      <div className="dialog-heading">
        <span className="eyebrow">{body ? body.kind : "Planets and Stars"}</span>
        <button
          id="close-about"
          onClick={() => dialogRef.current.close()}
          aria-label="Close data panel"
        >
          ×
        </button>
      </div>
      <h2 id="data-panel-title">{body ? body.name : "Data & controls"}</h2>
      {body ? <BodyFacts body={body} /> : (
        <p>Compare physical diameters. Positions and spacing are illustrative.</p>
      )}
      <details className="data-section">
        <summary>Sizes & rotation</summary>
        <p>All comparisons preserve physical diameter ratios.
          M and B abbreviate million and billion kilometres.</p>

      <p>
        Planet diameters are equatorial; flattening and axial tilts are
        included. Spin uses sidereal periods from{" "}
        <a
          href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/"
          target="_blank"
          rel="noreferrer"
        >
          NASA’s planetary fact sheets
        </a>
        . A single time multiplier applies to every body. Atmospheric winds and
        cloud drift are not modeled. Retrograde rotation is encoded by the
        tilted spin axis, without reversing it a second time. Starting
        longitudes and tilt directions are illustrative, not an ephemeris.
      </p>
      <p>
        The Sun uses a 695,700 km radius and a representative 609.12-hour
        rotation from the{" "}
        <a
          href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html"
          target="_blank"
          rel="noreferrer"
        >
          NASA Sun fact sheet
        </a>
        . The Sun and gas giants rotate differentially; this model uses a single
        reference period.
      </p>
      <p>
        Sirius A’s radius is 1.713 ± 0.009 solar radii (
        <a
          href="https://arxiv.org/abs/1010.3790"
          target="_blank"
          rel="noreferrer"
        >
          Davis et al., 2011
        </a>
        ). Betelgeuse uses one model estimate of 764 (+116/−62) solar radii (
        <a
          href="https://arxiv.org/abs/2006.09837"
          target="_blank"
          rel="noreferrer"
        >
          Joyce et al., 2020
        </a>
        ); its size is uncertain and variable. These distant stars have
        illustrative surface maps and no simulated spin because a reliable
        period is not adopted here.
      </p>
      </details>
      <details className="data-section">
        <summary>Black holes & extremes</summary>
      <p>
        “Largest” and “smallest” are candidates, not settled records. Stellar
        radii depend on distance, atmosphere models and variability; black hole
        masses also have measurement uncertainty. Each new object has an adopted
        estimate and source, available through Details.
      </p>
      <p>
        Black holes use the Schwarzschild reference horizon diameter,
        D = 4GM/c², approximately 5.9065 km per solar mass. This assumes no spin;
        it is not the larger shadow or accretion disk seen in telescope images.
        The sphere is black, with a faint boundary guide added for visibility.
        Gravitational lensing and accretion are not simulated. The GW190814
        companion may instead have been a neutron star, in which case its
        displayed horizon would not apply.
      </p>
      </details>
      <details className="data-section data-sources">
        <summary>Object sources</summary>
        <dl>
          {BODIES.filter((body) => body.source).map((body) => (
            <div key={body.id}>
              <dt>{body.name} · ≈ {diameterText(body.diameter)}{body.type === "black-hole" ? " horizon" : ""}</dt>
              <dd>
                {body.note}{" "}
                <a href={body.source.url} target="_blank" rel="noreferrer">{body.source.label} ↗</a>
                {body.caveatSource && <> · <a href={body.caveatSource.url} target="_blank" rel="noreferrer">{body.caveatSource.label} ↗</a></>}
              </dd>
            </div>
          ))}
        </dl>
      </details>
      <details className="data-section">
        <summary>Surface maps & credits</summary>
      <p>
        Textures by{" "}
        <a
          href="https://www.solarsystemscope.com/textures/"
          target="_blank"
          rel="noreferrer"
        >
          Solar System Scope
        </a>
        , licensed under{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noreferrer"
        >
          CC BY 4.0
        </a>
        . Maps combine imagery and artistic reconstruction; some colors are
        enhanced. Venus shows its cloud tops, carried at the solid-body rotation
        rate in this simplified model. Distant stars reuse a tinted solar map
        for illustration. Lighting, atmosphere glow and stellar brightness are
        adjusted for visibility.
      </p>
      </details>
      <details className="data-section">
        <summary>Controls</summary>
      <p>
        Drag to orbit in any direction, scroll or pinch to zoom, and right-drag
        or use two fingers to pan. Click a body or its comparison card to focus.
        Press <kbd>F</kbd> to fit everything, <kbd>Space</kbd> to pause, or{" "}
        <kbd>/</kbd> to search. Body labels start hidden; enable
        them under Display settings. Very small objects retain their true sizes
        even below one pixel; select their cards to inspect them up close.
      </p>
      </details>
    </dialog>
  );
}

function BodyFacts({ body }) {
  return (
    <div className="body-facts">
      <dl className="fact-grid">
        <div><dt>{body.type === "black-hole" ? "Reference horizon" : "Diameter"}</dt><dd>{body.uncertain ? "≈ " : ""}{diameterText(body.diameter)}</dd></div>
        <div><dt>Earth diameters</dt><dd>{(body.diameter / byId.earth.diameter).toLocaleString("en-US", { maximumSignificantDigits: 4 })}×</dd></div>
        {body.type === "black-hole" ? (
          <div><dt>Mass</dt><dd>≈ {body.solarMasses.toLocaleString("en-US")} Suns</dd></div>
        ) : (
          <>
            <div><dt>Rotation</dt><dd>{periodText(body.period)}{body.period < 0 ? " · retrograde" : ""}</dd></div>
            <div><dt>Axial tilt</dt><dd>{body.tilt == null ? "Not modeled" : `${body.tilt}°`}</dd></div>
          </>
        )}
      </dl>
      {body.note && <p>{body.note}</p>}
      {body.illustrative && body.type !== "black-hole" && <p>Illustrative surface; rotation is not modeled.</p>}
      {body.type === "black-hole" && <p>Nonrotating horizon model. The rim is a visibility guide; lensing and accretion are not simulated.</p>}
      {body.source && <p><a href={body.source.url} target="_blank" rel="noreferrer">{body.source.label} ↗</a>{body.caveatSource && <> · <a href={body.caveatSource.url} target="_blank" rel="noreferrer">{body.caveatSource.label} ↗</a></>}</p>}
    </div>
  );
}
