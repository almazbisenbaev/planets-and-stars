import * as THREE from "three";

// Seamless 3D procedural illustrations: no invented photographic surface maps.
export function createExoplanetMaterial(body) {
  const material = new THREE.MeshStandardMaterial({ color: body.color, roughness: 1 });
  material.customProgramCacheKey = () => `exoplanet-${body.appearance}`;
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = `varying vec3 vSurfacePosition;\n${shader.vertexShader}`
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvSurfacePosition = position;");
    shader.fragmentShader = `
      varying vec3 vSurfacePosition;
      float surfaceHash(vec3 p) {
        return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
      }
      float surfaceNoise(vec3 p) {
        vec3 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(surfaceHash(i), surfaceHash(i+vec3(1,0,0)), f.x),
          mix(surfaceHash(i+vec3(0,1,0)), surfaceHash(i+vec3(1,1,0)), f.x), f.y),
          mix(mix(surfaceHash(i+vec3(0,0,1)), surfaceHash(i+vec3(1,0,1)), f.x),
          mix(surfaceHash(i+vec3(0,1,1)), surfaceHash(i+vec3(1,1,1)), f.x), f.y), f.z);
      }
      float surfaceDetail(vec3 p) {
        return surfaceNoise(p)*0.57 + surfaceNoise(p*2.1)*0.28 + surfaceNoise(p*4.3)*0.15;
      }
      ${shader.fragmentShader}`;
    const detail = body.appearance === "lava"
      ? `float terrain = surfaceDetail(vSurfacePosition * 8.0);
         float molten = 1.0 - smoothstep(0.025, 0.085, abs(terrain - 0.5));
         diffuseColor.rgb = mix(vec3(0.045, 0.035, 0.03), vec3(0.95, 0.24, 0.025), molten);`
      : body.appearance === "cloudy"
        ? `float terrain = surfaceDetail(vSurfacePosition * vec3(5.0, 14.0, 5.0));
           diffuseColor.rgb = mix(diffuseColor.rgb * 0.5, vec3(0.83, 0.89, 0.9), smoothstep(0.3, 0.72, terrain));`
        : `float terrain = surfaceDetail(vSurfacePosition * 7.0);
           diffuseColor.rgb *= 0.45 + terrain * 0.85;`;
    shader.fragmentShader = shader.fragmentShader.replace("#include <color_fragment>", `#include <color_fragment>\n${detail}`);
    if (body.appearance === "lava") {
      shader.fragmentShader = shader.fragmentShader.replace("#include <emissivemap_fragment>",
        "#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(0.8, 0.08, 0.003) * molten;");
    }
  };
  return material;
}
