import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { byId, speeds, diameterText, radiusFor, spinTiltDegrees } from "./celestial-data.js";
import { createExoplanetMaterial } from "./exoplanet-material.js";

// All GPU resources and DOM listeners belong to this one mounted scene.
// React owns the application UI; this module owns only the canvas and its labels.
export function createCelestialScene({
  host,
  labelsContainer,
  ruler,
  initialState,
  onFocus,
  onWarning,
  onError,
  onReady,
}) {
  let state = { ...initialState };
  let disposed = false;
  let resizeObserver;
  const listeners = new AbortController();
  let renderer,
    scene,
    camera,
    controls,
    bodyGroup,
    models = [],
    ambient,
    keyLight,
    fillLight,
    bounds = { width: 12, height: 6 },
    comparisonBounds = bounds,
    textureCache = new Map();
  let elapsedHours = 0;
  let viewScale = 1;

  function texture(name) {
    if (textureCache.has(name)) return textureCache.get(name);
    const t = new THREE.TextureLoader().load(
      "/textures/" + name,
      (loaded) => {
        if (disposed) loaded.dispose();
      },
      undefined,
      () => {
        if (!disposed)
          onWarning(
            "A surface map could not load. Please reload to try again.",
          );
      },
    );
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    textureCache.set(name, t);
    return t;
  }
  function axisAngle(body) {
    return THREE.MathUtils.degToRad(
      -spinTiltDegrees(body, state.tilt),
    );
  }
  function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-8, 8, 4, -4, 0.00001, 500);
    camera.position.set(0, 12, 30);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    host.appendChild(renderer.domElement);
    renderer.domElement.setAttribute(
      "aria-label",
      "3D comparison. Drag to orbit, scroll to zoom. Use comparison cards to focus.",
    );
    renderer.domElement.setAttribute("tabindex", "0");
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan = true;
    controls.minZoom = 0.2;
    controls.maxZoom = 1000000;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;
    controls.zoomToCursor = true;
    controls.rotateSpeed = 0.6;
    ambient = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambient);
    keyLight = new THREE.DirectionalLight(0xfff8ed, 2.8);
    keyLight.position.set(-8, 7, 12);
    scene.add(keyLight);
    fillLight = new THREE.DirectionalLight(0xa4caff, 0.25);
    fillLight.position.set(8, 0, -5);
    scene.add(fillLight);
    bodyGroup = new THREE.Group();
    scene.add(bodyGroup);
    const positions = [],
      starColors = [];
    let seed = 37;
    function rand() {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    }
    for (let i = 0; i < 600; i++) {
      positions.push(
        (rand() - 0.5) * 130,
        (rand() - 0.5) * 90,
        -70 - rand() * 30,
      );
      const c = 0.23 + rand() * 0.4;
      starColors.push(c, c * 1.03, c * 1.12);
    }
    const starsGeo = new THREE.BufferGeometry();
    starsGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    starsGeo.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(starColors, 3),
    );
    const stars = new THREE.Points(
      starsGeo,
      new THREE.PointsMaterial({
        size: 1.2,
        vertexColors: true,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.6,
      }),
    );
    scene.add(stars);
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    let down;
    renderer.domElement.addEventListener(
      "pointerdown",
      (e) => (down = { x: e.clientX, y: e.clientY }),
      { signal: listeners.signal },
    );
    renderer.domElement.addEventListener(
      "pointerup",
      (e) => {
        if (!down || Math.hypot(down.x - e.clientX, down.y - e.clientY) > 5)
          return;
        const rect = renderer.domElement.getBoundingClientRect();
        const ray = new THREE.Raycaster();
        ray.setFromCamera(
          new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            (-(e.clientY - rect.top) / rect.height) * 2 + 1,
          ),
          camera,
        );
        const hit = ray.intersectObjects(
          models.map((m) => m.mesh),
          false,
        )[0];
        if (hit) focusBody(hit.object.userData.bodyId);
      },
      { signal: listeners.signal },
    );
    renderer.domElement.addEventListener(
      "webglcontextlost",
      (e) => {
        e.preventDefault();
        onError("The 3D view was interrupted. Reload this page to restore it.");
      },
      { signal: listeners.signal },
    );
    rebuildScene();
    setLighting();
    resize();
    onReady();
    renderer.setAnimationLoop(animate);
  }
  function setLighting() {
    ambient.intensity =
      state.lighting === "flat"
        ? 3
        : state.lighting === "sunlight"
          ? 0.12
          : 1.1;
    keyLight.intensity = state.lighting === "flat" ? 0 : 2.8;
    fillLight.intensity = state.lighting === "studio" ? 0.25 : 0;
  }
  const sphereGeo = new THREE.SphereGeometry(1, 96, 64);
  function rebuildScene() {
    if (!bodyGroup) return;
    models.forEach((m) => {
      bodyGroup.remove(m.root);
      m.root.traverse((o) => {
        if (o.material) o.material.dispose();
        if (o.geometry && o.geometry !== sphereGeo) o.geometry.dispose();
      });
    });
    models = [];
    labelsContainer.replaceChildren();
    const selected = state.selected.map((id) => byId[id]);
    if (!selected.length) {
      comparisonBounds = { width: 10, height: 5 };
      fitView();
      return;
    }
    const radii = selected.map((b) => radiusFor(b, selected));
    const maxRadius = Math.max(...radii);
    const extents = selected.map((b, i) => radii[i] * (b.rings ? 2.3 : 1));
    const gap = 0.8;
    const total =
      extents.reduce((sum, r) => sum + 2 * r, 0) + (selected.length - 1) * gap;
    let cursor = -total / 2;
    selected.forEach((b, i) => {
      const radius = radii[i];
      const root = new THREE.Group();
      root.position.x = cursor + extents[i];
      cursor += extents[i] * 2 + gap;
      const axis = new THREE.Group();
      axis.rotation.z = axisAngle(b);
      root.add(axis);
      const mat = b.type === "black-hole"
        ? new THREE.ShaderMaterial({
            uniforms: { rimColor: { value: new THREE.Color(b.color) } },
            vertexShader:
              "varying vec3 vN; void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
            // A thin, view-independent outline marks the physical horizon boundary.
            // This is a diagram, not a simulated photon ring or accretion disk.
            fragmentShader:
              "uniform vec3 rimColor; varying vec3 vN; void main(){float edge=pow(1.0-abs(normalize(vN).z),8.0);gl_FragColor=vec4(rimColor*edge*0.8,1.0);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}",
          })
        : b.type === "exoplanet"
        ? createExoplanetMaterial(b)
        : b.illustrative && b.type === "star"
        ? new THREE.ShaderMaterial({
            uniforms: {
              surfaceMap: { value: texture(b.texture) },
              starColor: { value: new THREE.Color(b.color) },
            },
            vertexShader:
              "varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
            fragmentShader:
              "uniform sampler2D surfaceMap;uniform vec3 starColor;varying vec2 vUv;void main(){vec3 tex=texture2D(surfaceMap,vUv).rgb;float detail=dot(tex,vec3(0.2126,0.7152,0.0722));gl_FragColor=vec4(starColor*(0.65+detail*0.55),1.0);}",
          })
        : b.type === "star"
          ? new THREE.MeshBasicMaterial({
              map: texture(b.texture),
              color: 0xffffff,
            })
          : new THREE.MeshStandardMaterial({
              map: texture(b.texture),
              roughness: 1,
              metalness: 0,
            });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.scale.set(radius, radius * (1 - b.flattening), radius);
      mesh.rotation.y = b.id === "earth" ? 2.1 : 0.7;
      mesh.userData.bodyId = b.id;
      axis.add(mesh);
      if (b.id === "earth" || b.type === "star") {
        const glow = new THREE.Mesh(
          sphereGeo,
          new THREE.ShaderMaterial({
            uniforms: {
              glowColor: {
                value: new THREE.Color(b.id === "earth" ? "#5a9fe9" : b.color),
              },
            },
            vertexShader:
              "varying vec3 vN;varying vec3 vP;void main(){vN=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.0);vP=p.xyz;gl_Position=projectionMatrix*p;}",
            fragmentShader:
              "uniform vec3 glowColor;varying vec3 vN;varying vec3 vP;void main(){float rim=pow(1.0-abs(dot(normalize(vN),normalize(-vP))),3.0);gl_FragColor=vec4(glowColor,rim*0.38);}",
            transparent: true,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
        glow.scale.setScalar(1.025);
        mesh.add(glow);
      }
      if (b.id === "earth") {
        const clouds = new THREE.Mesh(
          sphereGeo,
          new THREE.MeshStandardMaterial({
            map: texture("2k_earth_clouds.jpg"),
            alphaMap: texture("2k_earth_clouds.jpg"),
            transparent: true,
            opacity: 0.48,
            depthWrite: false,
            roughness: 1,
          }),
        );
        clouds.scale.setScalar(1.007);
        mesh.add(clouds);
      }
      if (b.rings) {
        const inner = 1.239 * radius,
          outer = 2.27 * radius,
          geometry = new THREE.RingGeometry(inner, outer, 192);
        const pos = geometry.attributes.position,
          uv = geometry.attributes.uv;
        for (let j = 0; j < pos.count; j++) {
          const length = Math.hypot(pos.getX(j), pos.getY(j));
          uv.setXY(j, (length - inner) / (outer - inner), 0.5);
        }
        const ring = new THREE.Mesh(
          geometry,
          new THREE.MeshStandardMaterial({
            map: texture("2k_saturn_ring_alpha.png"),
            transparent: true,
            side: THREE.DoubleSide,
            roughness: 1,
            depthWrite: false,
          }),
        );
        ring.rotation.x = -Math.PI / 2;
        axis.add(ring);
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -radius * 1.45, 0),
        new THREE.Vector3(0, radius * 1.45, 0),
      ]);
      const axisLine = new THREE.Line(
        lineGeo,
        new THREE.LineDashedMaterial({
          color: 0xc5ee9a,
          transparent: true,
          opacity: 0.45,
          dashSize: radius * 0.08,
          gapSize: radius * 0.06,
        }),
      );
      axisLine.computeLineDistances();
      axisLine.visible = state.axes && b.tilt != null;
      axis.add(axisLine);
      bodyGroup.add(root);
      const label = document.createElement("button");
      label.className = "body-label";
      label.style.display = "none";
      label.innerHTML = `<i class="label-dot" style="background:${b.color}"></i><strong>${b.name}</strong><span>${b.uncertain ? "≈ " : ""}${diameterText(b.diameter)}</span>`;
      label.setAttribute("aria-label", `Focus ${b.name}`);
      label.onclick = () => focusBody(b.id);
      const leader = document.createElement("div");
      leader.className = "label-leader";
      leader.style.display = "none";
      leader.setAttribute("aria-hidden", "true");
      labelsContainer.appendChild(leader);
      labelsContainer.appendChild(label);
      models.push({
        body: b,
        root,
        layoutX: root.position.x,
        axis,
        mesh,
        label,
        leader,
        radius,
        axisLine,
        baseRotation: mesh.rotation.y,
      });
    });
    comparisonBounds = { width: total, height: maxRadius * 2.3 + 1.7 };
    fitView();
  }
  function resize() {
    if (!renderer) return;
    const width = Math.max(host.clientWidth, 1),
      height = Math.max(host.clientHeight, 1);
    renderer.setSize(width, height);
    const aspect = width / height;
    const h = Math.max(bounds.height, bounds.width / aspect) * 0.59;
    camera.left = -h * aspect;
    camera.right = h * aspect;
    camera.top = h;
    camera.bottom = -h;
    camera.updateProjectionMatrix();
  }
  function fitView() {
    if (!camera) return;
    viewScale = 1;
    bounds = comparisonBounds;
    models.forEach((m) => {
      m.root.position.set(m.layoutX, 0, 0);
      m.root.scale.setScalar(1);
    });
    controls.target.set(0, -0.7, 0);
    camera.zoom = 1;
    camera.position.set(0, 12, 30);
    controls.update();
    resize();
  }
  function focusBody(id) {
    const m = models.find((m) => m.body.id === id);
    if (!m) return;
    const direction = camera.position.clone().sub(controls.target).normalize();
    if (!direction.length()) direction.set(0, 0, 1);
    // Rebase in CPU double precision before uploading transforms to the GPU.
    // Every body gets the SAME unit conversion, preserving physical size ratios
    // even for a ~15 km horizon beside TON 618 (~390 billion km).
    viewScale = 2 / m.radius;
    models.forEach((model) => {
      model.root.position.set((model.layoutX - m.layoutX) * viewScale, 0, 0);
      model.root.scale.setScalar(viewScale);
    });
    const extent = m.body.rings ? 10.5 : 5;
    bounds = { width: extent, height: extent };
    controls.target.set(0, 0, 0);
    camera.position.copy(direction).multiplyScalar(30);
    camera.zoom = 1;
    resize();
    controls.update();
    onFocus(id);
  }
  let lastTime = 0,
    lastRulerText = "";
  function animate(now) {
    if (disposed) return;
    const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 0;
    lastTime = now;
    if (state.playing && !document.hidden)
      elapsedHours += (dt * speeds[state.speed]) / 3600;
    models.forEach((m) => {
      if (m.body.period)
        m.mesh.rotation.y =
          m.baseRotation +
          (elapsedHours / Math.abs(m.body.period)) * Math.PI * 2;
    });
    controls.update();
    scene.updateMatrixWorld();
    const width = host.clientWidth,
      height = host.clientHeight;
    const occupied = [];
    models.forEach((m) => {
      const point = new THREE.Vector3(
        m.root.position.x,
        -m.radius * viewScale * (m.body.rings ? 1.3 : 1),
        0,
      ).project(camera);
      const anchorX = (point.x * 0.5 + 0.5) * width;
      const anchorY = (-point.y * 0.5 + 0.5) * height;
      const eligible =
        state.labels &&
        anchorX > 0 &&
        anchorX < width &&
        anchorY > 15 &&
        anchorY < height - 50 &&
        point.z < 1;
      m.label.style.display = eligible ? "block" : "none";
      m.leader.style.display = "none";
      if (!eligible) return;
      const labelWidth = m.label.offsetWidth;
      const labelHeight = m.label.offsetHeight;
      const x = Math.max(
        labelWidth / 2 + 8,
        Math.min(width - labelWidth / 2 - 8, anchorX),
      );
      const candidates = [
        anchorY + 9,
        anchorY + 15 + labelHeight,
        anchorY - labelHeight - 18,
        anchorY + 21 + 2 * labelHeight,
        anchorY - 2 * labelHeight - 18,
      ];
      const y = candidates.find((candidate) => {
        if (candidate < 35 || candidate + labelHeight > height - 6)
          return false;
        const rectangle = {
          left: x - labelWidth / 2,
          right: x + labelWidth / 2,
          top: candidate,
          bottom: candidate + labelHeight,
        };
        return !occupied.some(
          (other) =>
            rectangle.left < other.right + 4 &&
            rectangle.right > other.left - 4 &&
            rectangle.top < other.bottom + 3 &&
            rectangle.bottom > other.top - 3,
        );
      });
      if (y === undefined) {
        m.label.style.display = "none";
        return;
      }
      occupied.push({
        left: x - labelWidth / 2,
        right: x + labelWidth / 2,
        top: y,
        bottom: y + labelHeight,
      });
      m.label.style.left = x + "px";
      m.label.style.top = y + "px";
      const endY = y < anchorY ? y + labelHeight : y;
      const dx = x - anchorX,
        dy = endY - anchorY;
      if (Math.hypot(dx, dy) > 20) {
        m.leader.style.display = "block";
        m.leader.style.left = anchorX + "px";
        m.leader.style.top = anchorY + "px";
        m.leader.style.width = Math.hypot(dx, dy) + "px";
        m.leader.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
      }
    });
    const maxD = Math.max(...state.selected.map((id) => byId[id].diameter), 1);
    const kmPerWorld = maxD / 4 / viewScale;
    const kmPer100px =
      ((kmPerWorld * (camera.right - camera.left)) / camera.zoom / width) * 100;
    const rulerText = !state.selected.length
      ? "—"
      : diameterText(kmPer100px);
    if (rulerText !== lastRulerText) {
      ruler.textContent = rulerText;
      lastRulerText = rulerText;
    }
    renderer.render(scene, camera);
  }

  function update(nextState) {
    if (disposed) return;
    const rebuild =
      state.selected.join(",") !== nextState.selected.join(",");
    state = { ...nextState };
    if (rebuild) rebuildScene();
    models.forEach((model) => {
      model.axis.rotation.z = axisAngle(model.body);
      model.axisLine.visible = state.axes && model.body.tilt != null;
    });
    setLighting();
  }

  function frontView() {
    fitView();
    camera.position.set(0, -0.7, 30);
    camera.up.set(0, 1, 0);
    controls.update();
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    listeners.abort();
    resizeObserver?.disconnect();
    renderer?.setAnimationLoop(null);
    controls?.dispose();
    const geometries = new Set([sphereGeo]);
    const materials = new Set();
    scene?.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material)
        (Array.isArray(object.material)
          ? object.material
          : [object.material]
        ).forEach((material) => materials.add(material));
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    textureCache.forEach((map) => map.dispose());
    textureCache.clear();
    renderer?.dispose();
    renderer?.forceContextLoss();
    renderer?.domElement.remove();
    labelsContainer.replaceChildren();
    models = [];
  }

  try {
    initScene();
  } catch (error) {
    dispose();
    throw error;
  }
  return { update, focus: focusBody, fit: fitView, front: frontView, dispose };
}
