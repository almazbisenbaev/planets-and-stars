import { BODIES, diameterText } from "../lib/celestial-data.js";

export default function AboutDialog({ dialogRef }) {
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
    <dialog id="about-dialog" ref={dialogRef} onClick={handleBackdrop}>
      <div className="dialog-heading">
        <span className="eyebrow">BEHIND THE COMPARISON</span>
        <button
          id="close-about"
          onClick={() => dialogRef.current.close()}
          aria-label="Close about dialog"
        >
          ×
        </button>
      </div>
      <h2>
        A little science.
        <br />A lot of perspective.
      </h2>
      <p>
        True scale preserves physical diameter ratios. An orthographic camera
        avoids perspective size distortion. Objects are arranged for comparison;
        their positions and spacing are not astronomical.
      </p>
      <h3>Sizes & rotation</h3>
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
      <h3>Cosmic extremes & black holes</h3>
      <p>
        “Largest” and “smallest” are candidates, not settled records. Stellar
        radii depend on distance, atmosphere models and variability; black hole
        masses also have measurement uncertainty. Each new object has an adopted
        estimate and source, available by selecting its comparison card.
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
      <details className="data-sources">
        <summary>Measurements for the {BODIES.filter((body) => body.source).length} new objects</summary>
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
      <h3>Surface maps</h3>
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
      <h3>Explore in 3D</h3>
      <p>
        Drag to orbit in any direction, scroll or pinch to zoom, and right-drag
        or use two fingers to pan. Click a body or its comparison card to focus.
        Press <kbd>F</kbd> to fit everything, <kbd>Space</kbd> to pause, or{" "}
        <kbd>/</kbd> to search. Equal size mode helps inspect surface detail,
        but does not preserve size ratios. Body labels start hidden; enable
        them under Display settings. Very small objects retain their true sizes
        even below one pixel; select their cards to inspect them up close.
      </p>
    </dialog>
  );
}
