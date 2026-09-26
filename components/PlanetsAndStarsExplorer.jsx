"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { BODIES, byId, speedNames } from "../lib/celestial-data.js";
import {
  INITIAL_STATE,
  comparisonSchema,
  readComparison,
  validateComparison,
} from "../lib/comparison.js";
import CelestialScene from "./CelestialScene";
import AboutDialog from "./AboutDialog";
import { CatalogBody, BodyCard, ComparisonInsight } from "./ComparisonControls";

export default function PlanetsAndStarsExplorer() {
  const [state, setState] = useState(INITIAL_STATE);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [focusedId, setFocusedId] = useState(null);
  const [toast, setToast] = useState("");
  const [detailsId, setDetailsId] = useState(null);
  const stateRef = useRef(INITIAL_STATE);
  const sceneRef = useRef(null);
  const aboutRef = useRef(null);
  const searchRef = useRef(null);
  const toastTimer = useRef(null);
  const playbackInitialized = useRef(false);

  const update = useCallback((patch) => {
    const next = { ...stateRef.current, ...patch };
    stateRef.current = next;
    setState(next);
    return next;
  }, []);

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(""), 3500);
  }, []);

  const changeSelection = useCallback(
    (selected) => {
      update({ selected });
      setFocusedId(null);
    },
    [update],
  );

  const toggleBody = useCallback(
    (id) => {
      const selected = stateRef.current.selected;
      if (selected.includes(id))
        changeSelection(selected.filter((bodyId) => bodyId !== id));
      else if (selected.length >= 6)
        showToast("Compare up to six bodies. Remove one to make room.");
      else changeSelection([...selected, id]);
    },
    [changeSelection, showToast],
  );

  const recordFocus = useCallback((id) => setFocusedId(id), []);
  const openDetails = useCallback((id = null) => {
    setDetailsId(id);
    aboutRef.current.showModal();
    aboutRef.current.scrollTop = 0;
  }, []);
  const focusBody = useCallback((id) => sceneRef.current?.focus(id), []);
  const fitView = useCallback(() => {
    sceneRef.current?.fit();
    setFocusedId(null);
  }, []);

  useEffect(() => {
    if (!playbackInitialized.current) {
      playbackInitialized.current = true;
      update({
        playing: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
    }
    return () => clearTimeout(toastTimer.current);
  }, [update]);

  useEffect(() => {
    function onKeyDown(event) {
      if (
        event.defaultPrevented ||
        ["INPUT", "SELECT", "TEXTAREA"].includes(event.target.tagName) ||
        aboutRef.current?.open
      )
        return;
      if (
        event.key === " " &&
        !event.target.closest('button, a, [role="button"]')
      ) {
        event.preventDefault();
        update({ playing: !stateRef.current.playing });
      }
      if (event.key.toLowerCase() === "f") fitView();
      if (event.key === "/") {
        event.preventDefault();
        flushSync(() => setLibraryOpen(true));
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        setSettingsOpen(false);
        setLibraryOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [fitView, update]);

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const tools = [
      {
        name: "read_comparison",
        title: "Read celestial comparison",
        description:
          "Read the bodies, physical data, and rotation speed currently shown.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: () => readComparison(stateRef.current),
      },
      {
        name: "compare_bodies",
        title: "Compare celestial bodies",
        description:
          "Replace the visible comparison with one to six bodies at true scale. Does not change external data.",
        inputSchema: comparisonSchema,
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        async execute(input) {
          const patch = validateComparison(input);
          flushSync(() => changeSelection(patch.selected));
          await new Promise(requestAnimationFrame);
          return readComparison(stateRef.current);
        },
      },
    ];
    for (const tool of tools) {
      try {
        Promise.resolve(
          context.registerTool(tool, { signal: lifecycle.signal }),
        ).catch((error) => {
          if (!lifecycle.signal.aborted)
            console.warn(
              "Optional structured action unavailable:",
              error.message,
            );
        });
      } catch (error) {
        console.warn("Optional structured action unavailable:", error.message);
      }
    }
    return () => lifecycle.abort();
  }, [changeSelection]);

  const selectedBodies = state.selected.map((id) => byId[id]);
  const normalizeSearch = (text) => text.toLowerCase().replaceAll("biggest", "largest").replace(/[-*]/g, " ");
  const filteredBodies = BODIES.filter(
    (body) =>
      (filter === "all" || body.type === filter) &&
      normalizeSearch(`${body.name} ${body.kind} ${body.highlight || ""}`)
        .includes(normalizeSearch(search).trim()),
  );

  return (
    <>
      <header className="header">
        <a className="brand" href="/" aria-label="Planets and Stars home">
          <svg viewBox="0 0 44 44" aria-hidden="true">
            <circle cx="22" cy="22" r="10" />
            <ellipse
              cx="22"
              cy="22"
              rx="20"
              ry="7"
              transform="rotate(-35 22 22)"
            />
          </svg>
          <span className="brand-name">Planets and Stars</span>
        </a>
        <div className="header-right">
          <button
            id="about"
            onClick={() => openDetails()}
            className="text-button"
          >
            <span className="info-icon" aria-hidden="true">i</span> Data & help
          </button>
        </div>
      </header>
      <div className="app-shell">
        <aside className={`library${libraryOpen ? " open" : ""}`} id="library">
          <div className="library-title">
            <h2>Bodies</h2>
            <span className="count">{BODIES.length}</span>
            <button
              id="close-library"
              onClick={() => setLibraryOpen(false)}
              aria-label="Close celestial library"
            >
              ×
            </button>
          </div>
          <label className="search">
            <svg viewBox="0 0 24 24">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              id="search"
              ref={searchRef}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              type="search"
              placeholder="Search bodies…"
              aria-label="Search celestial bodies"
            />
            <kbd>/</kbd>
          </label>
          <div className="filters" role="group" aria-label="Body type">
            <button
              className={filter === "all" ? "active" : ""}
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={filter === "planet" ? "active" : ""}
              aria-pressed={filter === "planet"}
              onClick={() => setFilter("planet")}
            >
              Planets
            </button>
            <button
              className={filter === "star" ? "active" : ""}
              aria-pressed={filter === "star"}
              onClick={() => setFilter("star")}
            >
              Stars
            </button>
            <button
              className={filter === "moon" ? "active" : ""}
              aria-pressed={filter === "moon"}
              onClick={() => setFilter("moon")}
            >
              Moons
            </button>
            <button
              className={filter === "black-hole" ? "active" : ""}
              aria-pressed={filter === "black-hole"}
              onClick={() => setFilter("black-hole")}
            >
              Black holes
            </button>
          </div>
          <div className="catalog" id="catalog">
            {filteredBodies.length ? (
              filteredBodies.map((body) => (
                <CatalogBody
                  key={body.id}
                  body={body}
                  selected={state.selected.includes(body.id)}
                  onToggle={toggleBody}
                />
              ))
            ) : (
              <p className="empty-message">
                No matches.
              </p>
            )}
          </div>
        </aside>
        <main className="workspace" aria-label="Celestial comparison">
          <div className="mobile-library-bar">
            <button
              className="mobile-library"
              id="library-toggle"
              onClick={() => setLibraryOpen((open) => !open)}
              aria-expanded={libraryOpen}
            >
              ＋ Add bodies
            </button>
          </div>
          <section
            className="viewport"
            id="viewport"
            aria-label="Interactive 3D celestial comparison"
          >
            <CelestialScene
              state={state}
              controllerRef={sceneRef}
              onFocus={recordFocus}
              onWarning={showToast}
            />
            <div className="scene-tools">
              <button
                id="fit"
                onClick={fitView}
                aria-label="Fit all bodies in view"
                title="Fit all bodies (F)"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5M8 8h8v8H8z" />
                </svg>
              </button>
              <button
                id="front"
                onClick={() => { sceneRef.current?.front(); setFocusedId(null); }}
                aria-label="Reset to front view"
                title="Front view"
              >
                <svg viewBox="0 0 24 24">
                  <path d="m12 3 9 5v8l-9 5-9-5V8zM3 8l9 5 9-5M12 13v8" />
                </svg>
              </button>
              <button
                id="settings-button"
                onClick={() => setSettingsOpen((open) => !open)}
                aria-label="Display settings"
                aria-expanded={settingsOpen}
                title="Display settings"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M4 7h16M4 17h16M8 4v6M16 14v6" />
                </svg>
              </button>
            </div>
            <div
              className="view-settings"
              id="view-settings"
              hidden={!settingsOpen}
            >
              <h3>Display settings</h3>
              <label>
                Axial tilt
                <input
                  type="checkbox"
                  id="tilt"
                  checked={state.tilt}
                  onChange={(event) => update({ tilt: event.target.checked })}
                  role="switch"
                />
              </label>
              <label>
                Body labels
                <input
                  type="checkbox"
                  id="labels"
                  checked={state.labels}
                  onChange={(event) => update({ labels: event.target.checked })}
                  role="switch"
                />
              </label>
              <label>
                Rotation axes
                <input
                  type="checkbox"
                  id="axes"
                  checked={state.axes}
                  onChange={(event) => update({ axes: event.target.checked })}
                  role="switch"
                />
              </label>
              <label>
                Lighting
                <select
                  id="lighting"
                  value={state.lighting}
                  onChange={(event) => update({ lighting: event.target.value })}
                >
                  <option value="studio">Studio</option>
                  <option value="sunlight">Sunlight</option>
                  <option value="flat">Full illumination</option>
                </select>
              </label>
            </div>
          </section>
          <section className="comparison-tray">
            <div className="tray-heading">
              <span id="selected-count" aria-label={`${state.selected.length} of 6 bodies selected`}>
                {state.selected.length} / 6
              </span>
              <div className="tray-actions">
                <button
                  id="clear"
                  onClick={() => changeSelection([])}
                  className="text-button"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="selected-bodies" id="selected-bodies">
              {selectedBodies.length ? (
                selectedBodies.map((body) => (
                  <BodyCard
                    key={body.id}
                    body={body}
                    onFocus={focusBody}
                    focused={focusedId === body.id}
                    onRemove={toggleBody}
                  />
                ))
              ) : (
                <div className="empty-tray">
                  Add a body to start.
                </div>
              )}
            </div>
            <div className="insight" id="insight">
              <ComparisonInsight
                bodies={selectedBodies}
                focusedId={focusedId}
                onDetails={openDetails}
              />
            </div>
          </section>
          <footer className="playback">
            <button
              id="play"
              onClick={() => update({ playing: !state.playing })}
              className="play-button"
              aria-label={state.playing ? "Pause rotation" : "Play rotation"}
              title={`${state.playing ? "Pause" : "Play"} rotation (Space)`}
            >
              {state.playing ? "Ⅱ" : "▶"}
            </button>
            <div className="playback-label">
              <strong>Rotation</strong>
            </div>
            <label className="speed-control" htmlFor="speed">
              <span className="sr-only">Rotation speed</span>
              <input
                id="speed"
                onChange={(event) =>
                  update({ speed: Number(event.target.value) })
                }
                type="range"
                min="0"
                max="5"
                step="1"
                value={state.speed}
              />
              <output id="speed-value">{speedNames[state.speed]}</output>
            </label>
            <button
              id="realtime"
              aria-label="Reset to real time"
              title="Reset to real time"
              onClick={() => {
                update({ speed: 0 });
              }}
              className="text-button"
            >
              ↺
            </button>
          </footer>
        </main>
      </div>
      <div id="toast" className={toast ? "show" : ""} role="status">
        {toast}
      </div>
      <AboutDialog dialogRef={aboutRef} body={byId[detailsId]} />
    </>
  );
}
