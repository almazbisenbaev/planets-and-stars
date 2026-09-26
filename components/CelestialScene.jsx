"use client";

import { useEffect, useRef, useState } from "react";

export default function CelestialScene({
  state,
  controllerRef,
  onFocus,
  onWarning,
}) {
  const hostRef = useRef(null);
  const labelsRef = useRef(null);
  const rulerRef = useRef(null);
  const latestRef = useRef({ state, onFocus, onWarning });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    latestRef.current = { state, onFocus, onWarning };
    controllerRef.current?.update(state);
  }, [state, onFocus, onWarning, controllerRef]);

  useEffect(() => {
    let cancelled = false;
    let scene;
    setStatus("loading");
    import("../lib/celestial-scene.js")
      .then(({ createCelestialScene }) => {
        if (cancelled) return;
        scene = createCelestialScene({
          host: hostRef.current,
          labelsContainer: labelsRef.current,
          ruler: rulerRef.current,
          initialState: latestRef.current.state,
          onFocus: (id) => latestRef.current.onFocus(id),
          onWarning: (message) => latestRef.current.onWarning(message),
          onError: (message) => {
            if (!cancelled) {
              setError(message);
              setStatus("error");
            }
          },
          onReady: () => {
            if (!cancelled) setStatus("ready");
          },
        });
        controllerRef.current = scene;
      })
      .catch((cause) => {
        if (cancelled) return;
        console.error("Could not initialize the celestial scene:", cause);
        setError(
          "Your browser could not start the 3D view. Enable hardware acceleration or try a WebGL 2 compatible browser.",
        );
        setStatus("error");
      });
    return () => {
      cancelled = true;
      scene?.dispose();
      if (controllerRef.current === scene) controllerRef.current = null;
    };
  }, [controllerRef]);

  return (
    <>
      <div id="canvas-host" ref={hostRef} />
      <div id="body-labels" ref={labelsRef} />
      {status !== "ready" && (
        <div className="loading" id="loading" role="status">
          {status === "error" ? (
            error
          ) : (
            <>
              Preparing your universe<span>Loading surface maps</span>
            </>
          )}
        </div>
      )}
      <div className="scene-bottom">
        <div className="orbit-hint">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 10V5a2 2 0 0 1 4 0v5M13 9a2 2 0 0 1 4 0v1a2 2 0 0 1 3 2v3c0 4-2 6-6 6-3 0-5-2-7-5l-3-4a2 2 0 0 1 3-2l2 2" />
          </svg>
          <span>
            Drag to orbit <span>·</span> Scroll to zoom
          </span>
        </div>
        <div className="scale-ruler">
          <div />
          <span id="ruler-label" ref={rulerRef}>
            —
          </span>
        </div>
      </div>
    </>
  );
}
